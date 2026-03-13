import { EntryForm } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/errors/api-errors";
import { getSessionUser } from "@/lib/get-session-user";
import { normalizeTerm } from "@/lib/normalize-term";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import z from "zod";
import { Prisma } from "@/generated/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  //check if user is logged in
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();

  const { id: termId } = await params;
  if (!z.cuid().safeParse(termId).success) return ApiError.badRequest();

  try {
    const entry = await prisma.entry.findFirst({
      where: {
        userId: user.id,
        id: termId,
        deletedAt: null,
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

const EditEntrySchema = z.object({
  term: z.string().min(1).trim().optional(),
  notes: z.string().optional(),
  form: z.enum(EntryForm).optional(),
  tags: z.array(z.string()).optional(),
  primaryDefinitionId: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  //1 - Check user
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();

  //2- Get the entry ID
  const { id: entryId } = await params;
  if (!z.cuid().safeParse(entryId).success) return ApiError.badRequest();

  //3 - check payload format
  const body = await request.json();
  const parsed = EditEntrySchema.safeParse(body);
  if (!parsed.success) return ApiError.badRequest();
  const data = parsed.data;

  try {
    //4 and 5 - get the target entry and its definitions
    const entry = await prisma.entry.findFirst({
      where: {
        userId: user.id,
        id: entryId,
        deletedAt: null,
      },
      include: {
        definitions: true,
        entryTags: { include: { tag: true } },
      },
    });

    //if the entry doesn't belong to the user
    if (!entry) return ApiError.notFound();

    //Check if definition belongs to the target entry
    if (data.primaryDefinitionId) {
      const belongs = entry.definitions.some(
        (def) => def.id === data.primaryDefinitionId
      );
      if (!belongs)
        return ApiError.badRequest("definition-doesnt-belong-to-entry");
    }

    //Step 6 - check if the new tags belong to the user
    if (data.tags && data.tags.length > 0) {
      const foundTags = await prisma.tag.findMany({
        where: {
          userId: user.id,
          id: { in: data.tags }, // this asks for prisma to find tags whose ids are IN the array data.tags
        },
      });
      if (foundTags.length !== data.tags.length)
        return ApiError.badRequest("one-or-more-tags-not-found");
    }

    //7 - If term is on the payload
    const normalizedTerm = data.term ? normalizeTerm(data.term) : undefined;

    //8 - Edit the entry -  FINALLY!
    const payload = {
      term: data.term,
      termNormalized: normalizedTerm,
      primaryDefinitionId: data.primaryDefinitionId,
      notes: data.notes,
      form: data.form,
    };

    const updatedEntry = await prisma.$transaction(async (tx) => {
      // update the entry scalar fields
      const updated = await tx.entry.update({
        where: { id: entryId },
        data: payload,
      });

      // replace tags only if tags were sent in the payload
      if (data.tags !== undefined) {
        await tx.entryTag.deleteMany({
          where: { entryId: entryId },
        });

        if (data.tags.length > 0) {
          await tx.entryTag.createMany({
            data: data.tags.map((tagId) => ({
              entryId,
              tagId,
            })),
          });
        }
      }

      return updated;
    });

    return Response.json({ data: updatedEntry });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return ApiError.badRequest("entry-for-term-exists");
    }
    console.error("PATCH /entries error:", error);
    return ApiError.internal();
  }
}

//SOFT DELETE AN ENTRY
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();

  const { id: entryId } = await params;
  if (!z.cuid().safeParse(entryId).success)
    return ApiError.badRequest("invalid-url");

  try {
    const entry = await prisma.entry.findFirst({
      where: {
        userId: user.id,
        id: entryId,
        deletedAt: null,
      },
    });
    if (!entry) return ApiError.notFound();

    await prisma.entry.update({
      where: { id: entryId },
      data: { deletedAt: new Date() },
    });

    return Response.json({
      data: { id: entryId, term: entry.term },
    });
  } catch (error) {
    console.error("DELETE /entries error:", error);
    return ApiError.internal();
  }
}
