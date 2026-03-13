import { NounArticle, PartOfSpeech } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/errors/api-errors";
import { getSessionUser } from "@/lib/get-session-user";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import z from "zod";

const CreateDefinitionSchema = z
  .object({
    termOverride: z.string().min(1).trim().optional(),
    translation: z.string().min(1).trim(),
    notes: z.string().min(1).trim().optional(),
    partOfSpeech: z.enum(PartOfSpeech).optional(),
    nounArticle: z.enum(NounArticle).optional(),
  })
  .refine(
    (data) => data.partOfSpeech !== "noun" || data.nounArticle !== undefined,
    { message: "nounArticle is required when partOfSpeech is noun" }
  )
  .refine(
    (data) => data.partOfSpeech === "noun" || data.nounArticle === undefined,
    { message: "nounArticle is only valid when partOfSpeech is noun" }
  );

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();

  //validate the ID from the URL
  const { id: entryId } = await params;
  if (!z.cuid().safeParse(entryId).success)
    return ApiError.badRequest("invalid-url");

  //2 - Check payload format
  const body = await request.json();
  const parsed = CreateDefinitionSchema.safeParse(body);
  if (!parsed.success) return ApiError.badRequest();
  const data = parsed.data;

  try {
    const entry = await prisma.entry.findFirst({
      where: {
        userId: user.id,
        id: entryId,
        deletedAt: null,
      },
    });

    if (!entry) return ApiError.notFound("entry-not-found");

    const definition = await prisma.definition.create({
      data: {
        ...data,
        entryId: entryId,
      },
    });

    return Response.json({ data: definition });
  } catch (error) {
    console.error("POST .../definitions error:", error);
    return ApiError.internal();
  }
}
