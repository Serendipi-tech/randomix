import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import './index';

builder.queryField('myFeedbacks', (t) =>
  t.prismaField({
    type: ['UserFeedback'],
    resolve: (query, _root, _args, ctx) => {
      if (!ctx.userId) {
        throw new GraphQLError('Not authenticated.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      return prisma.userFeedback.findMany({
        ...query,
        where: { userId: ctx.userId },
        orderBy: { createdAt: 'desc' },
      });
    },
  }),
);
