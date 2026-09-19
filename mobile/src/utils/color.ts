/** Estrae {r,g,b} da un colore token: alcuni (es. `primary`/`secondary` in light mode) sono
 *  definiti come `rgb(r, g, b)` invece di `#hex` — senza questo, parseInt su "rgb(...)" ritorna
 *  NaN e il colore risultante diventa nero invece della tinta voluta. */
function parseColor(color: string): { r: number; g: number; b: number } {
  const rgbMatch = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  if (rgbMatch) {
    return { r: Number(rgbMatch[1]), g: Number(rgbMatch[2]), b: Number(rgbMatch[3]) };
  }
  const num = parseInt(color.replace('#', ''), 16);
  return { r: (num >> 16) & 0xff, g: (num >> 8) & 0xff, b: num & 0xff };
}

/** Scurisce un colore (hex o rgb()) di una quantità 0-1, per generare gradienti mono-tono senza toccare theme.ts. */
export function darkenColor(color: string, amount: number): string {
  const { r, g, b } = parseColor(color);
  const nr = Math.max(0, r - Math.round(255 * amount));
  const ng = Math.max(0, g - Math.round(255 * amount));
  const nb = Math.max(0, b - Math.round(255 * amount));
  return `#${((1 << 24) + (nr << 16) + (ng << 8) + nb).toString(16).slice(1)}`;
}

/** Converte un colore token (hex o rgb()) in rgba(), per ombre/tinte derivate da un colore del tema invece che riscritte a mano. */
export function hexToRgba(color: string, alpha: number): string {
  const { r, g, b } = parseColor(color);
  return `rgba(${r},${g},${b},${alpha})`;
}
