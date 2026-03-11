import { ApiError } from "@/lib/errors/api-errors";
import { getSessionUser } from "@/lib/get-session-user";
import { normalizeTerm } from "@/lib/normalize-term";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();

  const q = request.nextUrl.searchParams.get("q");
  const tag = request.nextUrl.searchParams.get("tag");

  const normalizedQ = q ? normalizeTerm(q) : null;

  try {
    const entries = await prisma.entry.findMany({
      where: {
        userId: user.id,
        deletedAt: null, //this will exclude soft-deleted entries
        ...(normalizedQ && {
          //conditional - only happens if there is a query search param
          OR: [
            { termNormalized: { contains: normalizedQ } },
            {
              definitions: { some: { translation: { contains: normalizedQ } } },
            },
          ],
        }),
        ...(tag && {
          //conditional - only happens if there is a tag search param
          entryTags: {
            some: { tag: { slug: tag } },
          },
        }),
      },
      include: {
        primaryDefinition: true,
        entryTags: {
          include: { tag: true },
        },
      },
    });
    return Response.json({ data: entries });
  } catch (error) {
    console.error("GET /entries error:", error);
    return ApiError.internal();
  }
}
