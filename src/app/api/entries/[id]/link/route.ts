import { Prisma } from "@/generated/prisma/client";
import { ApiError } from "@/lib/errors/api-errors";
import { getSessionUser } from "@/lib/get-session-user";
import { prisma } from "@/lib/prisma";
import { CreateLinkSchema } from "@/validation/linksSchemas";
import { NextRequest } from "next/server";
import z from "zod";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();
  //get origin entry ID from the url
  const { id: originId } = await params;

  const body = await request.json();
  const parsed = CreateLinkSchema.safeParse(body);
  if (!parsed.success) return ApiError.badRequest();
  const data = parsed.data;

  if (data.targetId === originId)
    return ApiError.badRequest("link-entry-itself");

  const sortedIds = [originId, data?.targetId].sort();

  try {
    const entries = await prisma.entry.findMany({
      where: {
        userId: user.id,
        deletedAt: null,
        id: { in: sortedIds },
      },
    });

    if (entries.length !== 2) return ApiError.notFound();

    await prisma.entryLink.create({
      data: {
        aEntryId: sortedIds[0],
        bEntryId: sortedIds[1],
      },
    });

    return Response.json({
      data: { term1: entries[0].term, term2: entries[1].term },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return ApiError.badRequest("link-already-exists");
    }
    console.error("POST /entries/[id]/link error:", error);
    return ApiError.internal();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();
  //get origin entry ID from the url
  const { id: originId } = await params;

  const body = await request.json();
  const parsed = CreateLinkSchema.safeParse(body);
  if (!parsed.success) return ApiError.badRequest();
  const data = parsed.data;

  if (data.targetId === originId)
    return ApiError.badRequest("link-entry-itself");

  const sortedIds = [originId, data?.targetId].sort();

  try {
    const entryLink = await prisma.entryLink.findFirst({
      where: {
        aEntryId: sortedIds[0],
        bEntryId: sortedIds[1],
        aEntry: { userId: user.id },
        bEntry: { userId: user.id },
      },
      include: {
        aEntry: { select: { term: true } },
        bEntry: { select: { term: true } },
      },
    });
    if (!entryLink) return ApiError.notFound();
    await prisma.entryLink.delete({
      where: {
        aEntryId_bEntryId: {
          aEntryId: sortedIds[0],
          bEntryId: sortedIds[1],
        },
      },
    });

    return Response.json({
      data: { term1: entryLink.aEntry.term, term2: entryLink.bEntry.term },
    });
  } catch (error) {
    console.error("DELETE /entries/[id]/link error:", error);
    return ApiError.internal();
  }
}
