import { ApiError } from "@/lib/errors/api-errors";
import { getSessionUser } from "@/lib/get-session-user";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { Prisma } from "@/generated/prisma/client";

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();

  try {
    await prisma.user.delete({ where: { id: user.id } });
    return Response.json({ data: { id: user.id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return ApiError.notFound();
    }
    console.error("DELETE /user error:", error);
    return ApiError.internal();
  }
}
