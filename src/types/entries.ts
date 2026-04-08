import { Prisma } from "@/generated/prisma/client";

export type EntryListItem = Prisma.EntryGetPayload<{
  include: {
    primaryDefinition: true;
    entryTags: { include: { tag: true } };
  };
}>;
