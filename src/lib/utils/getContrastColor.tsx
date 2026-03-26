export function getContrastColor(hexColor: string) {
  // Remove o # se existir
  const hex = hexColor.replace("#", "");

  // Converte para RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calcula a luminosidade (fórmula padrão YIQ)
  // O peso maior é no Verde porque o olho humano é mais sensível a ele
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Se a luminosidade for maior que 128, a cor é clara (retorna texto preto)
  // Se for menor, a cor é escura (retorna texto branco)
  return yiq >= 128 ? "text-black" : "text-white";
}
