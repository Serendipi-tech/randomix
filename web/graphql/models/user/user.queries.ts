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

// Stessi limiti del DB (User.username @db.VarChar(20)): qui l'errore è leggibile, lì sarebbe un
// vincolo di colonna violato
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;

builder.mutationField('updateProfile', (t) =>
  t.prismaField({
    type: 'User',
    args: { input: t.arg({ type: UpdateProfileInput, required: true }) },
    resolve: async (query, _root, { input }, ctx) => {
      if (!ctx.userId) {
        throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      const username = input.username?.trim();
      if (username != null && (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH)) {
        throw new GraphQLError(
          `Lo username deve avere fra ${USERNAME_MIN_LENGTH} e ${USERNAME_MAX_LENGTH} caratteri.`,
          { extensions: { code: 'BAD_USER_INPUT' } },
        );
      }

      return prisma.user.update({
        ...query,
        where: { id: ctx.userId },
        data: {
          ...(username != null && { username }),
          ...(input.avatarUrl !== undefined && { avatarUrl: input.avatarUrl }),
          ...(input.language !== undefined && { language: input.language }),
        },
      });
    },
  }),
);
