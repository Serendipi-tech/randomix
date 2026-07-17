import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import './index';

function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

builder.mutationField('createTag', (t) =>
  t.prismaField({
    type: 'Tag',
    args: {
      name: t.arg.string({ required: true }),
      color: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, { name, color }, ctx) => {
      requireAuth(ctx.userId);
      const trimmed = name.trim();
      // evito duplicati tra i tag personali e quelli di sistema
      const existing = await prisma.tag.findFirst({
        where: { name: trimmed, OR: [{ userId: ctx.userId }, { userId: null }] },
      });
      if (existing) {
        throw new GraphQLError('Tag già esistente.', { extensions: { code: 'CONFLICT' } });
      }
      return prisma.tag.create({
        ...query,
        data: { name: trimmed, color, userId: ctx.userId },
      });
    },
  }),
);

builder.mutationField('deleteTag', (t) =>
  t.boolean({
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      requireAuth(ctx.userId);
      // solo i tag personali possono essere eliminati
      const tag = await prisma.tag.findFirst({ where: { id: String(id), userId: ctx.userId } });
      if (!tag) {
        throw new GraphQLError('Tag non trovato.', { extensions: { code: 'NOT_FOUND' } });
      }
      await prisma.tag.delete({ where: { id: String(id) } });
      return true;
    },
  }),
);
