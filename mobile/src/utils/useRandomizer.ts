import {
  randomColors,
  randomInt,
  randomLetters,
  randomNumbers,
  rollDice,
} from './random';

/**
 * Estrazioni del randomizzatore, calcolate sul dispositivo: sono risultati usa e getta, non
 * vengono salvati e non devono valere per altri utenti, quindi non passano dal backend (niente
 * latenza, niente obbligo di connessione). Le estrazioni condivise o legate alle liste restano
 * lato server, nelle loro mutation.
 *
 * Le funzioni restano async: i chiamanti le attendono e cosi' la firma non cambia se in futuro
 * una modalita' dovesse tornare al server.
 */
export function useRandomizer() {
  const generateNumbers = async (min: number, max: number, count: number, allowRepeats = false) =>
    randomNumbers(min, max, count, allowRepeats);

  const generateLetters = async (count: number) => randomLetters(count);

  const generateColors = async (count: number) => randomColors(count);

  const generateDice = async (count: number, faces: number) => rollDice(count, faces);

  // Indice vincente fra `count` partecipanti (usata dalla bottiglia con nomi)
  const drawWinnerIndex = async (count: number) => randomInt(0, count - 1);

  return {
    generateNumbers,
    generateLetters,
    generateColors,
    generateDice,
    drawWinnerIndex,
    loading: false,
    error: null as Error | null,
  };
}
