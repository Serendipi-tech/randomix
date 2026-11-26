import { useCallback, useMemo, useState } from 'react';
import { buildRevealDelays } from './revealSequence';

/**
 * Stato di una rivelazione a cascata: i ritardi d'ingresso di ogni elemento e la possibilita' di
 * saltare l'attesa. `skipped` passa a true al primo tocco e non torna indietro: ogni elemento
 * ancora in corso salta direttamente al valore finale.
 */
export function useRevealCascade(count: number, duration: number) {
  const [skipped, setSkipped] = useState(false);
  const delays = useMemo(() => buildRevealDelays(count, duration), [count, duration]);
  const skip = useCallback(() => setSkipped(true), []);

  return { delays, skipped, skip };
}
