import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';

builder.queryField('listCategories', (t) =>
  t.prismaField({
    type: ['ListCategory'],
    resolve: async (query, _root, _args, ctx) => {
      if (!ctx.userId) {
        throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      return prisma.listCategory.findMany({ ...query, orderBy: { name: 'asc' } });
    },
  }),
);
