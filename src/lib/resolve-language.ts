import { SUPPORTED_LANGUAGES } from "@/constants/supportedLanguages";

export type LanguageOptions = (typeof SUPPORTED_LANGUAGES)[number];
export type MultilingualText = Record<LanguageOptions, string>;

export function resolveLanguage(
  text: MultilingualText,
  lang: LanguageOptions = "pt",
): string {
  return text[lang];
}
