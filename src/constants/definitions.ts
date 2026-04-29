import { NounArticle, PartOfSpeech } from "@/generated/prisma/enums";

export const partOfSpeech: Record<PartOfSpeech, string> = {
  noun: "Substantivo",
  other: "Outro",
  verb: "Verbo",
};

export const nounArticle: Record<NounArticle, string> = {
  der: "Der",
  die: "Die",
  das: "Das",
  plural: "Plural",
  unknown: "Desconhecido",
};
