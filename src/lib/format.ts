export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("ru-RU");
}

export function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return "0 ₽";
  return n.toLocaleString("ru-RU") + " ₽";
}
