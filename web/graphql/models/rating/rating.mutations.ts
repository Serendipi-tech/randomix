import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import './index';

function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

builder.mutationField('rateItem', (t) =>
  t.prismaField({
    type: 'Rating',
    args: {
      itemId: t.arg.id({ required: true }),
      value: t.arg.int({ required: true }),
      note: t.arg.string({ required: false }),
    },
    resolve: async (query, _root, { itemId, value, note }, ctx) => {
      requireAuth(ctx.userId);
      if (value < 1 || value > 5) {
        throw new GraphQLError('Il voto deve essere tra 1 e 5.', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      return prisma.rating.upsert({
        ...query,
        where: { userId_itemId: { userId: ctx.userId, itemId: String(itemId) } },
        create: { userId: ctx.userId, itemId: String(itemId), value, note: note ?? null },
        update: { value, ...(note !== undefined && { note }) },
      });
    },
  }),
);

builder.mutationField('deleteRating', (t) =>
  t.boolean({
    args: { itemId: t.arg.id({ required: true }) },
    resolve: async (_root, { itemId }, ctx) => {
      requireAuth(ctx.userId);
      const rating = await prisma.rating.findFirst({
        where: { userId: ctx.userId, itemId: String(itemId) },
      });
      if (!rating) {
        throw new GraphQLError('Voto non trovato.', { extensions: { code: 'NOT_FOUND' } });
      }
      await prisma.rating.delete({ where: { id: rating.id } });
      return true;
    },
  }),
);
