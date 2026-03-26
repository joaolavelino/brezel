export function normalizeForSearch(text: string): string {
  if (!text) return "";

  return (
    text
      .toLowerCase()
      .trim()
      // 1. Decompõe caracteres acentuados (ex: 'ü' vira 'u' + '¨')
      .normalize("NFD")
      // 2. Remove os diacríticos (acentos)
      .replace(/[\u0300-\u036f]/g, "")
      // 3. Normalização específica do Alemão: Eszett vira 'ss'
      .replace(/ß/g, "ss")
      // 4. Remove espaços extras
      .replace(/\s+/g, "")
  );
}
