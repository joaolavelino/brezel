import { ApiError } from "@/lib/errors/api-errors";
import { getSessionUser } from "@/lib/get-session-user";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import z from "zod";

export const CreateExampleSchema = z.object({
  text: z.string().min(1).trim(),
  notes: z.string().min(1).trim().optional(),
});

export async function POST(
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
  const parsed = CreateExampleSchema.safeParse(body);
  if (!parsed.success) return ApiError.badRequest();
  const data = parsed.data;

  try {
    const definition = await prisma.definition.findFirst({
      where: {
        id: defId,
        entryId: entryId,
        entry: { userId: user.id, deletedAt: null },
      },
    });
    if (!definition) return ApiError.notFound();

    const example = await prisma.example.create({
      data: { ...data, definitionId: defId },
    });

    return Response.json({ data: example });
  } catch (error) {
    console.error("POST .../examples error:", error);
    return ApiError.internal();
  }
}
