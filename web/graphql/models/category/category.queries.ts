import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import './index';

builder.queryField('categories', (t) =>
  t.prismaField({
    type: ['Category'],
    resolve: async (query, _root, _args, ctx) => {
      if (!ctx.userId) {
        throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      return prisma.category.findMany({ ...query, orderBy: { name: 'asc' } });
    },
  }),
);
