import { ApiError } from "@/lib/errors/api-errors";
import { getSessionUser } from "@/lib/get-session-user";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

//list all the tags
export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();

  try {
    const tags = await prisma.tag.findMany({
      where: {
        userId: user.id,
      },
      orderBy: { slug: "asc" },
    });
    return Response.json({ data: tags });
  } catch (error) {
    console.error("GET /tags error:", error);
    return ApiError.internal();
  }
}
