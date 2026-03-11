import { ApiError } from "@/lib/errors/api-errors";
import { getSessionUser } from "@/lib/get-session-user";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  //check if user is logged in
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();

  const { id: termId } = await params;

  try {
    const entry = await prisma.entry.findFirst({
      where: {
        userId: user.id,
        id: termId,
      },
      include: {
        definitions: {
          include: { examples: true },
        },
        linksAsA: { include: { bEntry: true } },
        linksAsB: { include: { aEntry: true } },
        entryTags: { include: { tag: true } },
      },
    });

    if (!entry) return ApiError.notFound(); //404 error

    //response shaping - merge all the links to a single list
    const links = [
      ...entry.linksAsA.map((link) => link.bEntry),
      ...entry.linksAsB.map((link) => link.aEntry),
    ];

    const { linksAsA, linksAsB, ...entryData } = entry; //just to separate the rest of the entry from the original links

    return Response.json({ data: { ...entryData, links } }); //success
  } catch (error) {
    console.error("GET /entries/[id] error:", error);
    return ApiError.internal();
  }
}
