export function normalizeForSearch(text: string): string {
  if (!text) return "";

  return (
    text
      .toLowerCase()
      .trim()
      // Desmonta os acentos (ex: ü -> u + ¨)
      .normalize("NFD")
      // Remove os "restos" de acentos que sobraram da desmontagem
      .replace(/[\u0300-\u036f]/g, "")
      // Trata o caso especial do Eszett (que o NFD não quebra sozinho)
      .replace(/ß/g, "ss")
      // Opcional: remove múltiplos espaços se o usuário digitar errado
      .replace(/\s+/g, " ")
  );
}

export function sortByRelevance(
  aTerm: string,
  bTerm: string,
  cleanQuery: string
): number {
  const normalizedA = normalizeForSearch(aTerm);
  const normalizedB = normalizeForSearch(bTerm);

  // Verificamos quem começa com a busca
  const aStarts = normalizedA.startsWith(cleanQuery); // true ou false
  const bStarts = normalizedB.startsWith(cleanQuery); // true ou false

  // CASO 1: A começa com a busca e B não
  if (aStarts && !bStarts) return -1; // A sobe para o topo

  // CASO 2: B começa com a busca e A não
  if (!aStarts && bStarts) return 1; // B sobe para o topo (A desce)

  // CASO 3: Ambos começam com a busca OU nenhum começa
  // Aqui usamos a ordem alfabética padrão para não ficar bagunçado
  return normalizedA.localeCompare(normalizedB);
}
