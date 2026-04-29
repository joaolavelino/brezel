import { Entry, Prisma } from "@/generated/prisma/client";

export type EntryListItem = Prisma.EntryGetPayload<{
  include: {
    primaryDefinition: true;
    entryTags: { include: { tag: true } };
    definitions: true;
    linksAsA: { include: { bEntry: true } };
    linksAsB: { include: { aEntry: true } };
  };
}>;

export type EntryDetail = Prisma.EntryGetPayload<{
  include: {
    primaryDefinition: true;
    entryTags: { include: { tag: true } };
    definitions: { include: { examples: true } };
  };
}> & {
  links: Entry[];
};

export type CompleteDefinition = Prisma.DefinitionGetPayload<{
  include: {
    examples: true;
  };
}>;
