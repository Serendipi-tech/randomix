import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const RANDOM_NUMBERS: DocumentNode = parse(`
  query RandomNumbers($min: Int!, $max: Int!, $count: Int) {
    randomNumbers(min: $min, max: $max, count: $count)
  }
`);

export const RANDOM_LETTERS: DocumentNode = parse(`
  query RandomLetters($count: Int) {
    randomLetters(count: $count)
  }
`);

export const RANDOM_COLORS: DocumentNode = parse(`
  query RandomColors($count: Int) {
    randomColors(count: $count)
  }
`);

export const ROLL_DICE: DocumentNode = parse(`
  query RollDice($count: Int, $faces: Int) {
    rollDice(count: $count, faces: $faces)
  }
`);
