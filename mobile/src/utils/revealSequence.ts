/** Rapporto fra un ritardo e il successivo: ogni elemento parte sempre piu' vicino al precedente,
 *  quindi la cascata accelera da sola invece di scorrere a passo fisso. */
const REVEAL_RATIO = 0.6;

/** Tetto della sequenza: nessuna rivelazione, con qualunque numero di elementi, deve durare piu' di
 *  questo. Oltre, l'attesa non viene percepita come animazione ma come lentezza. */
const MAX_REVEAL_SEQUENCE_MS = 2400;

/**
 * Ritardi d'ingresso di una rivelazione a cascata.
 *
 * Con pochi elementi i ritardi valgono una durata piena, quindi ognuno aspetta davvero la fine del
 * precedente. Crescendo il numero, la somma geometrica si avvicina al suo limite e, se lo supera,
 * tutti i ritardi vengono riscalati per stare nel tetto: la cascata resta leggibile ma chiude in
 * fretta, come una slot machine.
 */
export function buildRevealDelays(count: number, duration: number): number[] {
  if (count <= 0) return [];

  const delays = Array.from(
    { length: count },
    (_, i) => (duration * (1 - REVEAL_RATIO ** i)) / (1 - REVEAL_RATIO),
  );

  const budget = Math.max(0, MAX_REVEAL_SEQUENCE_MS - duration);
  const last = delays[count - 1];
  if (last <= budget) return delays.map(Math.round);

  const scale = budget / last;
  return delays.map((delay) => Math.round(delay * scale));
}
