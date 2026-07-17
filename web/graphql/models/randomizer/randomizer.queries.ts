import { GraphQLError } from 'graphql';
import { builder } from '../../builder';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const MAX_EXTRACTIONS = 100;

function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

function badInput(message: string): never {
  throw new GraphQLError(message, { extensions: { code: 'BAD_USER_INPUT' } });
}

// estrazione senza ripetizione da un pool di valori
function drawUnique<T>(pool: T[], count: number): T[] {
  const copy = [...pool];
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }
  return result;
}

builder.queryField('randomNumbers', (t) =>
  t.intList({
    args: {
      min: t.arg.int({ required: true }),
      max: t.arg.int({ required: true }),
      count: t.arg.int({ required: false }),
    },
    resolve: (_root, { min, max, count }, ctx) => {
      requireAuth(ctx.userId);
      const n = count ?? 1;
      if (min > max) badInput('Il minimo deve essere <= del massimo.');
      if (n < 1 || n > MAX_EXTRACTIONS) badInput(`Le estrazioni devono essere tra 1 e ${MAX_EXTRACTIONS}.`);
      if (n > max - min + 1) badInput('Estrazioni superiori ai numeri disponibili nel range.');
      const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      return drawUnique(pool, n);
    },
  }),
);

builder.queryField('randomLetters', (t) =>
  t.stringList({
    args: { count: t.arg.int({ required: false }) },
    resolve: (_root, { count }, ctx) => {
      requireAuth(ctx.userId);
      const n = count ?? 1;
      if (n < 1 || n > ALPHABET.length) badInput(`Le estrazioni devono essere tra 1 e ${ALPHABET.length}.`);
      return drawUnique(ALPHABET, n);
    },
  }),
);

builder.queryField('randomColors', (t) =>
  t.stringList({
    args: { count: t.arg.int({ required: false }) },
    resolve: (_root, { count }, ctx) => {
      requireAuth(ctx.userId);
      const n = count ?? 1;
      if (n < 1 || n > MAX_EXTRACTIONS) badInput(`Le estrazioni devono essere tra 1 e ${MAX_EXTRACTIONS}.`);
      return Array.from({ length: n }, () => {
        const hex = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
        return `#${hex.toUpperCase()}`;
      });
    },
  }),
);

builder.queryField('rollDice', (t) =>
  t.intList({
    args: {
      count: t.arg.int({ required: false }),
      faces: t.arg.int({ required: false }),
    },
    resolve: (_root, { count, faces }, ctx) => {
      requireAuth(ctx.userId);
      const n = count ?? 1;
      const f = faces ?? 6;
      if (n < 1 || n > 20) badInput('I dadi devono essere tra 1 e 20.');
      if (f < 2 || f > 120) badInput('Le facce devono essere tra 2 e 120.');
      return Array.from({ length: n }, () => 1 + Math.floor(Math.random() * f));
    },
  }),
);
