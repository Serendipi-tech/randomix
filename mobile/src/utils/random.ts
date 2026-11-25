const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/** Estrazioni massime per singola generazione, come il vecchio limite del resolver. */
export const MAX_EXTRACTIONS = 100;

/** Intero casuale in [min, max], estremi inclusi. */
export function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** Estrae `count` valori distinti dal pool, senza modificarlo. */
export function drawUnique<T>(pool: T[], count: number): T[] {
  const copy = [...pool];
  const result: T[] = [];

  for (let i = 0; i < count && copy.length > 0; i++) {
    result.push(copy.splice(randomInt(0, copy.length - 1), 1)[0]);
  }

  return result;
}

/** Numeri nel range richiesto; con `allowRepeats` ogni estrazione è indipendente dalle altre. */
export function randomNumbers(
  min: number,
  max: number,
  count: number,
  allowRepeats = false,
): number[] {
  const n = Math.min(count, MAX_EXTRACTIONS);
  if (allowRepeats) return Array.from({ length: n }, () => randomInt(min, max));

  const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return drawUnique(pool, n);
}

/** Lettere distinte dell'alfabeto inglese. */
export function randomLetters(count: number): string[] {
  return drawUnique(ALPHABET, Math.min(count, ALPHABET.length));
}

/** Colori esadecimali, ripetizioni possibili: lo spazio dei colori è troppo grande perché contino. */
export function randomColors(count: number): string[] {
  return Array.from({ length: Math.min(count, MAX_EXTRACTIONS) }, () => {
    const hex = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0');
    return `#${hex.toUpperCase()}`;
  });
}

/** Lanci di dado indipendenti: ogni dado può ripetere il valore di un altro. */
export function rollDice(count: number, faces: number): number[] {
  return Array.from({ length: count }, () => randomInt(1, faces));
}
