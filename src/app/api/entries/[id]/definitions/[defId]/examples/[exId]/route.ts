import { ApiError } from "@/lib/errors/api-errors";
import { getSessionUser } from "@/lib/get-session-user";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import z from "zod";
import { Prisma } from "@/generated/prisma/client";

export const UpdateExampleSchema = z.object({
  text: z.string().min(1).trim().optional(),
  notes: z.string().min(1).trim().nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; defId: string; exId: string }> },
) {
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();

  //validate the ID and DefID from the URL
  const { id: entryId, defId, exId } = await params;
  if (
    !z
      .object({ entryId: z.cuid(), defId: z.cuid(), exId: z.cuid() })
      .safeParse({ entryId, defId, exId }).success
  )
    return ApiError.badRequest("invalid-url");

  const body = await request.json();
  const parsed = UpdateExampleSchema.safeParse(body);
  if (!parsed.success) return ApiError.badRequest();
  const data = parsed.data;

  if (Object.keys(data).length === 0)
    return ApiError.badRequest("no-fields-to-update");

  try {
    const updated = await prisma.example.update({
      where: {
        id: exId,
        definitionId: defId,
        definition: {
          entryId: entryId,
          entry: { userId: user.id, deletedAt: null },
        },
      },
      data: data,
    });

    return Response.json({ data: updated });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return ApiError.notFound();
    }
    console.error("PATCH .../examples/[exId]  error:", error);
    return ApiError.internal();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; defId: string; exId: string }> },
) {
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();

  //validate the ID and DefID from the URL
  const { id: entryId, defId, exId } = await params;
  if (
    !z
      .object({ entryId: z.cuid(), defId: z.cuid(), exId: z.cuid() })
      .safeParse({ entryId, defId, exId }).success
  )
    return ApiError.badRequest("invalid-url");

  try {
    const deleted = await prisma.example.delete({
      where: {
        id: exId,
        definitionId: defId,
        definition: {
          entryId: entryId,
          entry: { userId: user.id, deletedAt: null },
        },
      },
    });

    return Response.json({ data: { text: deleted.text } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return ApiError.notFound();
    }
    console.error("DELETE .../examples/[exId] error:", error);
    return ApiError.internal();
  }
}
