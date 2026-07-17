import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';

function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

builder.mutationField('drawFromList', (t) =>
  t.prismaField({
    type: 'List_UserItem',
    args: {
      listId: t.arg.id({ required: true }),
      // presente solo quando si rigenera: l'elemento precedente prende +1 skipped
      previousEntryId: t.arg.id({ required: false }),
    },
    resolve: async (query, _root, { listId, previousEntryId }, ctx) => {
      requireAuth(ctx.userId);
      const list = await prisma.list.findFirst({
        where: { id: String(listId), userId: ctx.userId },
      });
      if (!list) {
        throw new GraphQLError('Lista non trovata.', { extensions: { code: 'NOT_FOUND' } });
      }

      const entries = await prisma.list_UserItem.findMany({
        where: {
          listId: String(listId),
          // evito di riestrarre subito lo stesso elemento
          ...(previousEntryId ? { id: { not: String(previousEntryId) } } : {}),
        },
        select: { id: true },
      });
      if (entries.length === 0) {
        throw new GraphQLError('Nessun elemento estraibile nella lista.', {
          extensions: { code: 'EMPTY_LIST' },
        });
      }

      // skipped aumenta SOLO alla rigenerazione, mai su chiusura o abbandono
      if (previousEntryId) {
        await prisma.list_UserItem.updateMany({
          where: { id: String(previousEntryId), listId: String(listId) },
          data: { skippedCount: { increment: 1 } },
        });
      }

      const drawn = entries[Math.floor(Math.random() * entries.length)];
      return prisma.list_UserItem.update({
        ...query,
        where: { id: drawn.id },
        data: { count: { increment: 1 } },
      });
    },
  }),
);

builder.mutationField('acceptDraw', (t) =>
  t.prismaField({
    type: 'List_UserItem',
    args: { entryId: t.arg.id({ required: true }) },
    resolve: async (query, _root, { entryId }, ctx) => {
      requireAuth(ctx.userId);
      const entry = await prisma.list_UserItem.findFirst({
        where: { id: String(entryId), list: { userId: ctx.userId } },
      });
      if (!entry) {
        throw new GraphQLError('Elemento non trovato.', { extensions: { code: 'NOT_FOUND' } });
      }
      return prisma.list_UserItem.update({
        ...query,
        where: { id: String(entryId) },
        data: { acceptedCount: { increment: 1 } },
      });
    },
  }),
);
