import { EntryForm } from "@/generated/prisma/enums";

export const entryFormLabels: Record<EntryForm, string> = {
  word: "Palavra",
  phrase: "Frase",
  idiom: "Expressão",
  question: "Pergunta",
  not_sure: "Não sei",
};
