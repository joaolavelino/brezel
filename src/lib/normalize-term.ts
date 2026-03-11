// Normalization rule v1: lowercase + trim + collapse spaces
// Umlauts (ä, ö, ü) and eszett (ß) are preserved
// Changing this rule requires a data migration
export function normalizeTerm(term: string): string {
  return term.toLowerCase().trim().replace(/\s+/g, " ");
}
