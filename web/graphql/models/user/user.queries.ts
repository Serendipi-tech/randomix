import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import './index';

builder.queryField('me', (t) =>
  t.prismaField({
    type: 'User',
    nullable: true,
    resolve: async (query, _root, _args, ctx) => {
      if (!ctx.userId) return null;
      return prisma.user.findUnique({ ...query, where: { id: ctx.userId } });
    },
  }),
);

const UpdateProfileInput = builder.inputType('UpdateProfileInput', {
  fields: (t) => ({
    username: t.string({ required: false }),
    avatarUrl: t.string({ required: false }),
    language: t.string({ required: false }),
  }),
});

builder.mutationField('updateProfile', (t) =>
  t.prismaField({
    type: 'User',
    args: { input: t.arg({ type: UpdateProfileInput, required: true }) },
    resolve: async (query, _root, { input }, ctx) => {
      if (!ctx.userId) {
        throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      return prisma.user.update({
        ...query,
        where: { id: ctx.userId },
        data: {
          ...(input.username != null && { username: input.username }),
          ...(input.avatarUrl !== undefined && { avatarUrl: input.avatarUrl }),
          ...(input.language !== undefined && { language: input.language }),
        },
      });
    },
  }),
);
