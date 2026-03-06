import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

//no client agora tem uma função main que permite inserir dados

async function main() {
  //created a dev user to test the application and put it in a variable to be able to reference its ID on later seeds
  const user = await prisma.user.upsert({
    where: {
      email: "dev@brezel.local",
    },
    update: {},
    create: {
      email: "dev@brezel.local",
      name: "Dev User",
    },
  });

  const tagTravel = await prisma.tag.upsert({
    where: {
      userId_slug: {
        userId: user.id,
        slug: "travel",
      },
    },
    update: {},
    create: {
      userId: user.id,
      name: "Travel",
      slug: "travel",
      color: "#4A90E2",
    },
  });
  const tagClothes = await prisma.tag.upsert({
    where: {
      userId_slug: {
        userId: user.id,
        slug: "clothes",
      },
    },
    update: {},
    create: {
      userId: user.id,
      name: "clothes",
      slug: "clothes",
    },
  });
  const tagRunning = await prisma.tag.upsert({
    where: {
      userId_slug: {
        userId: user.id,
        slug: "running",
      },
    },
    update: {},
    create: {
      userId: user.id,
      name: "Running",
      slug: "running",
      color: "#E25C4A",
    },
  });
  const tagMusic = await prisma.tag.upsert({
    where: {
      userId_slug: {
        userId: user.id,
        slug: "music",
      },
    },
    update: {},
    create: {
      userId: user.id,
      name: "Music",
      slug: "music",
    },
  });

  const entryLaufen = await prisma.entry.create({
    data: {
      userId: user.id,
      term: "laufen",
      termNormalized: "laufen",
      form: "word",
      notes:
        "One of those verbs that means different things depending on context.",
      entryTags: {
        create: [{ tagId: tagRunning.id }],
      },
      definitions: {
        create: [
          {
            translation: "to run",
            partOfSpeech: "verb",
            examples: {
              create: [{ text: "Ich laufe jeden Morgen im Park." }],
            },
          },
          {
            translation: "to walk",
            partOfSpeech: "verb",
            examples: {
              create: [{ text: "Wir sind in die Stadt gelaufen." }],
            },
          },
          {
            translation: "to operate / to run",
            partOfSpeech: "verb",
            notes: "Used for machines, programs, engines.",
            examples: {
              create: [{ text: "Der Motor läuft gut." }],
            },
          },
          {
            translation: "the run / Running",
            termOverride: "Laufen",
            partOfSpeech: "noun",
            nounArticle: "das",
            notes: "All the nominalized verbs in German are neuter",
            examples: {
              create: [
                { text: "Das Laufen ist im Winter kein einfacher Sport" },
              ],
            },
          },
          {
            translation: "running",
            termOverride: "laufenden",
            partOfSpeech: "other",
            notes: "it's used to say something is running - a nose or a car.",
            examples: {
              create: [
                {
                  text: "Ich warte auf dich bei laufendem Motor",
                  notes:
                    "From Niels Frever's song Bei Laufendem Motor - from the album Putzlicht",
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      definitions: true,
    },
  });
  await prisma.entry.update({
    where: { id: entryLaufen.id },
    data: {
      primaryDefinitionId: entryLaufen.definitions[0].id,
    },
  });

  const entrySchuh = await prisma.entry.create({
    data: {
      userId: user.id,
      term: "schuh",
      termNormalized: "schuh",
      form: "word",
      notes: "Normally used in the plural form Schuhe.",
      entryTags: {
        create: [{ tagId: tagClothes.id }],
      },
      definitions: {
        create: [
          {
            translation: "shoe",
            partOfSpeech: "noun",
            nounArticle: "der",
            examples: {
              create: [{ text: "Heute trage ich braune Schuhe." }],
            },
          },
        ],
      },
    },
    include: {
      definitions: true,
    },
  });
  await prisma.entry.update({
    where: { id: entrySchuh.id },
    data: {
      primaryDefinitionId: entrySchuh.definitions[0].id,
    },
  });
  const entryLaufschuh = await prisma.entry.create({
    data: {
      userId: user.id,
      term: "laufschuh",
      termNormalized: "laufschuh",
      form: "word",
      notes:
        "Normally used in the plural form Laufschuhe. Saw on the shoe store.",
      entryTags: {
        create: [{ tagId: tagClothes.id }, { tagId: tagRunning.id }],
      },
    },
  });
  await prisma.entryLink.create({
    data: {
      aEntryId: entryLaufschuh.id,
      bEntryId: entryLaufen.id,
    },
  });
  await prisma.entryLink.create({
    data: {
      aEntryId: entryLaufschuh.id,
      bEntryId: entrySchuh.id,
    },
  });
  await prisma.entry.create({
    data: {
      userId: user.id,
      term: "sonst noch etwas?",
      termNormalized: "sonst noch etwas",
      form: "question",
      notes:
        "Heard it from a clerk at the bakery, after asking for the bread. I think it's something like 'Anything else'?",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
