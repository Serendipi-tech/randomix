import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';

builder.queryField('myTags', (t) =>
  t.prismaField({
    type: ['Tag'],
    resolve: async (query, _root, _args, ctx) => {
      if (!ctx.userId) {
        throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      // tag personali dell'utente + tag di sistema
      return prisma.tag.findMany({
        ...query,
        where: { OR: [{ userId: ctx.userId }, { userId: null }] },
        orderBy: { name: 'asc' },
      });
    },
  }),
);
