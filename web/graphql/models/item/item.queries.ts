import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import './index';

function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

builder.queryField('item', (t) =>
  t.prismaField({
    type: 'Item',
    nullable: true,
    args: { id: t.arg.id({ required: true }) },
    resolve: async (query, _root, { id }, ctx) => {
      requireAuth(ctx.userId);
      return prisma.item.findUnique({ ...query, where: { id: String(id) } });
    },
  }),
);
