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

/** Luminanza relativa percepita (0 = nero, 1 = bianco): pesa i canali come li vede l'occhio. */
export function colorLuminance(color: string): number {
  const { r, g, b } = parseColor(color);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/** True se sul colore serve inchiostro scuro: usato per scegliere il testo senza fissarlo a mano. */
export function isLightColor(color: string): boolean {
  return colorLuminance(color) > 0.6;
}

/** Mescola due colori: `amount` 0 restituisce `base`, 1 restituisce `tint`. Serve a tirare un
 *  token verso un altro (es. lo sfondo verso l'accent) senza inventare valori fuori dal tema. */
export function mixColors(base: string, tint: string, amount: number): string {
  const a = parseColor(base);
  const b = parseColor(tint);
  const channel = (from: number, to: number) => Math.round(from + (to - from) * amount);
  const r = channel(a.r, b.r);
  const g = channel(a.g, b.g);
  const bl = channel(a.b, b.b);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}

// Sfondo interno delle card a guscio sfumato: viola medio, non il quasi nero delle superfici —
// il foreground tirato verso il primario, un po' di più a sinistra, e poi virato verso il rosso
const SURFACE_FILL_LEFT = 0.18;
const SURFACE_FILL_RIGHT = 0.05;
const SURFACE_FILL_RED_TINT = 0.13;

/** Coppia di colori (sinistra, destra) del riempimento sfumato condiviso da RandomizerCard e dalla
 *  variante `gradient-fill` di CardShell. */
export function surfaceFillGradient(foreground: string, primary: string, redTint: string): readonly [string, string] {
  return [
    mixColors(mixColors(foreground, primary, SURFACE_FILL_LEFT), redTint, SURFACE_FILL_RED_TINT),
    mixColors(mixColors(foreground, primary, SURFACE_FILL_RIGHT), redTint, SURFACE_FILL_RED_TINT),
  ] as const;
}
