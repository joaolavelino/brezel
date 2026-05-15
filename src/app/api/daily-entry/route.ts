import { Prisma } from "@/generated/prisma/client";
import { ApiError } from "@/lib/errors/api-errors";
import { getSessionUser } from "@/lib/get-session-user";
import { normalizeTerm } from "@/lib/normalize-term";
import { prisma } from "@/lib/prisma";
import { entrySingleLanguage } from "@/lib/resolve-greeting-entry";
import { SaveDailyEntrySchema } from "@/validation/dailyEntry";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  //1 - Check user
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();

  //2 - get payload and get language
  const body = await request.json();

  const resolvedLanguageBody = entrySingleLanguage(body);

  //3 -  Check payload format
  const parsed = SaveDailyEntrySchema.safeParse(resolvedLanguageBody);
  console.log(parsed.error);
  if (!parsed.success) return ApiError.badRequest();
  const data = parsed.data;

  const dataEntry = {
    term: data.term,
    notes: data.notes,
    form: data.form ?? "not-sure",
    termNormalized: normalizeTerm(data.term),
    userId: user.id,
  };

  //Create Entry
  try {
    const addedCompleteEntry = await prisma.$transaction(async (tx) => {
      const brezelTag = await tx.tag.upsert({
        where: { userId_slug: { slug: "brezel", userId: user.id } },
        update: {},
        create: {
          name: "Brezel",
          slug: "brezel",
          userId: user.id,
          color: "#412B20",
        },
      });

      const newEntry = await tx.entry.create({
        data: { ...dataEntry, entryTags: { create: { tagId: brezelTag.id } } },
      });

      const newDefinition = await tx.definition.create({
        data: { ...data.definition, entryId: newEntry.id },
      });

      const newExample = await tx.example.create({
        data: { ...data.example, definitionId: newDefinition.id },
      });

      return newEntry;
    });

    return Response.json({ data: addedCompleteEntry });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return ApiError.badRequest("entry-already-exists");
    }
    console.error("POST /entries error:", error);
    return ApiError.internal();
  }
}
