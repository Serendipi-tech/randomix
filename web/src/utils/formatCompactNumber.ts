export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('it-IT', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}
