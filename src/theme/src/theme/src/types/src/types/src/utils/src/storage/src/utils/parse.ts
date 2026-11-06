export function parseToCents(text: string): number {
  const n = parseFloat(text.replace(/\./g, '').replace(',', '.'));
  if (isNaN(n) || n <= 0) return 0;
  return Math.round(n * 100);
}
