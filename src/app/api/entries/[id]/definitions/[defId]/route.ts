import { Prisma } from "@/generated/prisma/client";
import { NounArticle, PartOfSpeech } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/errors/api-errors";
import { getSessionUser } from "@/lib/get-session-user";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import z from "zod";

export const UpdateDefinitionSchema = z
  .object({
    termOverride: z.string().min(1).trim().optional(),
    translation: z.string().min(1).trim().optional(),
    notes: z.string().min(1).trim().optional(),
    partOfSpeech: z.enum(PartOfSpeech).optional(),
    nounArticle: z.enum(NounArticle).nullable().optional(),
  })
  .refine(
    (data) => data.partOfSpeech !== "noun" || data.nounArticle !== undefined,
    { message: "nounArticle is required when partOfSpeech is noun" },
  );

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; defId: string }> },
) {
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();

  //validate the ID and DefID from the URL
  const { id: entryId, defId } = await params;
  if (
    !z
      .object({ entryId: z.cuid(), defId: z.cuid() })
      .safeParse({ entryId, defId }).success
  )
    return ApiError.badRequest("invalid-url");

  const body = await request.json();
  const parsed = UpdateDefinitionSchema.safeParse(body);
  if (!parsed.success) return ApiError.badRequest();
  const data = parsed.data;
  //Don't allow empty data updates - no unnecessary trips to the DB
  if (Object.keys(data).length === 0)
    return ApiError.badRequest("no-fields-to-update");
  //If the user send a different POS than "noun", the article is automatically set to null
  if (data.partOfSpeech && data.partOfSpeech !== "noun") {
    data.nounArticle = null;
  }

  try {
    //GET THE DEFINITION
    const definition = await prisma.definition.findFirst({
      where: {
        id: defId, //is this the correct definition
        entryId: entryId, //from the correct entry
        entry: { userId: user.id, deletedAt: null }, // that belongs to the correct user and it's not deleted
      },
    });

    if (!definition) return ApiError.notFound();

    //VALIDATE THE POS-NOUN RELATION
    if (definition.partOfSpeech !== "noun" && data.nounArticle)
      return ApiError.badRequest("nounArticle-not-valid-for-non-noun");

    const updated = await prisma.definition.update({
      where: { id: defId },
      data: data,
      include: { examples: true },
    });

    return Response.json({ data: updated });
  } catch (error) {
    console.error("PATCH .../definitions error:", error);
    return ApiError.internal();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; defId: string }> },
) {
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();

  //validate the ID and DefID from the URL
  const { id: entryId, defId } = await params;
  if (
    !z
      .object({ entryId: z.cuid(), defId: z.cuid() })
      .safeParse({ entryId, defId }).success
  )
    return ApiError.badRequest("invalid-url");

  try {
    const definition = await prisma.definition.delete({
      where: {
        id: defId, //is this the correct definition
        entryId: entryId, //from the correct entry
        entry: { userId: user.id, deletedAt: null }, // that belongs to the correct user and it's not deleted
      },
    });

    return Response.json({ data: { translation: definition.translation } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return ApiError.notFound();
    }
    console.error("DELETE .../definitions error:", error);
    return ApiError.internal();
  }
}
