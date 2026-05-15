import { EntryForm, NounArticle, PartOfSpeech } from "@/generated/prisma/enums";
import z from "zod";

export const SaveDailyEntrySchema = z.object({
  term: z.string().min(1).trim(),
  form: z.enum(EntryForm),
  notes: z.string().optional(),
  definition: z
    .object({
      translation: z.string().min(1),
      partOfSpeech: z.enum(PartOfSpeech),
      nounArticle: z.enum(NounArticle).optional(),
      notes: z.string().optional(),
    })
    .refine((data) => data.partOfSpeech !== "noun" || !!data.nounArticle, {
      message: "nounArticle is required when partOfSpeech is noun",
    })
    .refine((data) => data.partOfSpeech === "noun" || !data.nounArticle, {
      message: "nounArticle is only valid when partOfSpeech is noun",
    }),
  example: z.object({
    text: z.string().min(1),
    notes: z.string().optional(),
  }),
});
