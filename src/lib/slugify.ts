// Slugification rule v1: lowercase + trim + turn spaces into dashes
// Umlauts (ä, ö, ü) and eszett (ß) are preserved
// Changing this rule requires a data migration
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, "-");
}
