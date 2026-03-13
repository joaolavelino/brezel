import { ApiError } from "@/lib/errors/api-errors";
import { getSessionUser } from "@/lib/get-session-user";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { Prisma } from "@/generated/prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();

  const { id: entryId } = await params;

  try {
    const entry = await prisma.entry.update({
      where: {
        userId: user.id,
        id: entryId,
        deletedAt: { not: null },
      },
      data: {
        deletedAt: null,
      },
    });

    return Response.json({ data: { id: entry.id, term: entry.term } });
  } catch (error) {
    //This is the native Prisma not-found error on the .update method, similar to the duplication error.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return ApiError.notFound();
    }

    console.error("PATCH /entries/[id]/restore error:", error);
    return ApiError.internal();
  }
}
