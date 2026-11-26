import { useCallback, useEffect, useRef } from 'react';

// Attesa prima che la pressione prolungata inizi a ripetere: sotto questa soglia resta un tap
const INITIAL_DELAY_MS = 400;
// Cadenza della ripetizione
const INTERVAL_MS = 90;
// Dopo questo tempo di pressione continua si avanza a gruppi, non piu' di uno alla volta
const BURST_AFTER_MS = 1500;
const BURST_MULTIPLIER = 5;

/**
 * Pressione prolungata che ripete un passo: dopo una breve attesa avanza a cadenza fissa e, se la
 * pressione continua, passa a gruppi di cinque. Il tap singolo resta gestito da `onPress`.
 *
 * `onStep` riceve il moltiplicatore del passo; restituendo `false` (per esempio arrivata al
 * limite) ferma la ripetizione in corso.
 */
export function useRepeatPress(onStep: (multiplier: number) => boolean | void) {
  const handler = useRef(onStep);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const pressedAt = useRef(0);

  useEffect(() => {
    handler.current = onStep;
  }, [onStep]);

  const stop = useCallback(() => {
    if (timeout.current) clearTimeout(timeout.current);
    if (interval.current) clearInterval(interval.current);
    timeout.current = null;
    interval.current = null;
  }, []);

  // Nessun timer deve sopravvivere allo smontaggio del controllo
  useEffect(() => stop, [stop]);

  const start = useCallback(() => {
    stop();
    pressedAt.current = Date.now();

    timeout.current = setTimeout(() => {
      interval.current = setInterval(() => {
        const held = Date.now() - pressedAt.current;
        const advanced = handler.current(held >= BURST_AFTER_MS ? BURST_MULTIPLIER : 1);
        if (advanced === false) stop();
      }, INTERVAL_MS);
    }, INITIAL_DELAY_MS);
  }, [stop]);

  return { start, stop };
}
