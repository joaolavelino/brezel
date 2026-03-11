import { EntryForm } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/errors/api-errors";
import { getSessionUser } from "@/lib/get-session-user";
import { normalizeTerm } from "@/lib/normalize-term";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import z from "zod";
import { Prisma } from "@/generated/prisma/client";

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

const CreateEntrySchema = z.object({
  term: z.string().min(1).trim(),
  notes: z.string().optional(),
  form: z.enum(EntryForm).optional(),
  tags: z.array(z.string()).optional().default([]),
});

export async function POST(request: NextRequest) {
  //1 - check user
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();

  //2 - Check payload format
  const body = await request.json();
  const parsed = CreateEntrySchema.safeParse(body);
  if (!parsed.success) return ApiError.badRequest();
  const data = parsed.data;

  //3 - Normalize term
  const normalizedTerm = normalizeTerm(data.term);

  //4 - Create the entry
  try {
    const entry = await prisma.entry.create({
      data: {
        userId: user.id,
        term: data.term,
        termNormalized: normalizedTerm,
        notes: data.notes,
        form: data.form,
        entryTags: {
          create: data.tags.map((tagId) => ({ tagId })),
        },
      },
    });

    return Response.json({ data: entry });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return ApiError.badRequest("You already have an entry for this term");
    }
    console.error("POST /entries error:", error);
    return ApiError.internal();
  }
}
