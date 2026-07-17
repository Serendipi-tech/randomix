import { useLazyQuery } from '@apollo/client';
import { RandomizerQueries } from '@randomix/graphql-schema';

const { RANDOM_NUMBERS, RANDOM_LETTERS, RANDOM_COLORS, ROLL_DICE } = RandomizerQueries;

interface RandomNumbersQuery {
  randomNumbers: number[];
}
interface RandomLettersQuery {
  randomLetters: string[];
}
interface RandomColorsQuery {
  randomColors: string[];
}
interface RollDiceQuery {
  rollDice: number[];
}

// ogni estrazione deve essere nuova: mai servire risultati dalla cache
const OPTIONS = { fetchPolicy: 'network-only' } as const;

export function useRandomizer() {
  const [runNumbers, numbersState] = useLazyQuery<RandomNumbersQuery>(RANDOM_NUMBERS, OPTIONS);
  const [runLetters, lettersState] = useLazyQuery<RandomLettersQuery>(RANDOM_LETTERS, OPTIONS);
  const [runColors, colorsState] = useLazyQuery<RandomColorsQuery>(RANDOM_COLORS, OPTIONS);
  const [runDice, diceState] = useLazyQuery<RollDiceQuery>(ROLL_DICE, OPTIONS);

  const generateNumbers = async (min: number, max: number, count: number) => {
    const { data } = await runNumbers({ variables: { min, max, count } });
    return data?.randomNumbers ?? [];
  };

  const generateLetters = async (count: number) => {
    const { data } = await runLetters({ variables: { count } });
    return data?.randomLetters ?? [];
  };

  const generateColors = async (count: number) => {
    const { data } = await runColors({ variables: { count } });
    return data?.randomColors ?? [];
  };

  const generateDice = async (count: number, faces: number) => {
    const { data } = await runDice({ variables: { count, faces } });
    return data?.rollDice ?? [];
  };

  return {
    generateNumbers,
    generateLetters,
    generateColors,
    generateDice,
    loading:
      numbersState.loading || lettersState.loading || colorsState.loading || diceState.loading,
    error:
      numbersState.error ?? lettersState.error ?? colorsState.error ?? diceState.error ?? null,
  };
}
