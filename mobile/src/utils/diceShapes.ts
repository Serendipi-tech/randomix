export type DiceShapeBucket = 'pip' | 'diamond' | 'hexagon' | 'circle';

// più facce ha il dado, più la sagoma si arrotonda verso il cerchio
export function bucketForFaces(faces: number): DiceShapeBucket {
  if (faces <= 6) return 'pip';
  if (faces <= 9) return 'diamond';
  if (faces <= 14) return 'hexagon';
  return 'circle';
}

// disposizione pallini 3x3 classica, celle attive (1-9, riga per riga) per ogni valore 1-6
export const PIP_LAYOUT: Record<number, number[]> = {
  1: [5],
  2: [1, 9],
  3: [1, 5, 9],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9],
};
