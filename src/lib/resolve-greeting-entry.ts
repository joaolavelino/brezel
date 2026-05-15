import { GreetingEntry } from "@/data/greetings";
import { SaveDailyEntrySchema } from "@/validation/dailyEntry";
import z from "zod";
import { LanguageOptions, resolveLanguage } from "./resolve-language";

export type ResolvedGreetingEntry = z.infer<typeof SaveDailyEntrySchema>;

export const entrySingleLanguage = (
  entry: GreetingEntry,
  lang: LanguageOptions = "pt",
): ResolvedGreetingEntry => {
  const resolved = {
    term: entry.term,
    form: entry.form,
    notes: resolveLanguage(entry.notes, lang),
    definition: {
      translation: resolveLanguage(entry.definition.translation, lang),
      partOfSpeech: entry.definition.partOfSpeech,
      ...(entry.definition.nounArticle && {
        nounArticle: entry.definition.nounArticle,
      }),
      notes: resolveLanguage(entry.definition.notes, lang),
    },
    example: {
      text: entry.example.text,
      notes: resolveLanguage(entry.example.notes, lang),
    },
  };
  console.log(resolved);

  return resolved;
};
