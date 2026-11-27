/** Distanza temporale di un istante dal presente, in forma strutturata (valore + unità) invece che
 *  come stringa: la resa testuale resta a carico della UI, che la passa a i18n. */
export type RelativeUnit = 'now' | 'minute' | 'hour' | 'day' | 'week';

export interface RelativeTime {
  unit: RelativeUnit;
  value: number;
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

export function toRelativeTime(iso: string, now: number = Date.now()): RelativeTime {
  const elapsed = Math.max(0, now - new Date(iso).getTime());

  if (elapsed < MINUTE) return { unit: 'now', value: 0 };
  if (elapsed < HOUR) return { unit: 'minute', value: Math.floor(elapsed / MINUTE) };
  if (elapsed < DAY) return { unit: 'hour', value: Math.floor(elapsed / HOUR) };
  if (elapsed < WEEK) return { unit: 'day', value: Math.floor(elapsed / DAY) };
  return { unit: 'week', value: Math.floor(elapsed / WEEK) };
}
