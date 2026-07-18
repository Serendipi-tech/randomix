import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import './index';

function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

builder.mutationField('sendFriendRequest', (t) =>
  t.boolean({
    args: { userId: t.arg.id({ required: true }) },
    resolve: async (_root, { userId }, ctx) => {
      requireAuth(ctx.userId);
      const targetId = String(userId);
      if (targetId === ctx.userId) {
        throw new GraphQLError('Non puoi aggiungere te stesso.', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      const target = await prisma.user.findFirst({ where: { id: targetId, deletedAt: null } });
      if (!target) {
        throw new GraphQLError('Utente non trovato.', { extensions: { code: 'NOT_FOUND' } });
      }
      const existing = await prisma.friendship.findFirst({
        where: {
          OR: [
            { senderId: ctx.userId, receiverId: targetId },
            { senderId: targetId, receiverId: ctx.userId },
          ],
        },
      });
      if (existing?.status === 'ACCEPTED') {
        throw new GraphQLError('Siete già amici.', { extensions: { code: 'CONFLICT' } });
      }
      if (existing?.status === 'PENDING') {
        throw new GraphQLError('Richiesta già in corso.', { extensions: { code: 'CONFLICT' } });
      }
      // una richiesta rifiutata/annullata può essere reinviata: sostituisco il record
      if (existing) {
        await prisma.friendship.delete({ where: { id: existing.id } });
      }
      await prisma.friendship.create({ data: { senderId: ctx.userId, receiverId: targetId } });
      return true;
    },
  }),
);

builder.mutationField('acceptFriendRequest', (t) =>
  t.boolean({
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      requireAuth(ctx.userId);
      // solo il destinatario può accettare una richiesta in sospeso
      const request = await prisma.friendship.findFirst({
        where: { id: String(id), receiverId: ctx.userId, status: 'PENDING' },
      });
      if (!request) {
        throw new GraphQLError('Richiesta non trovata.', { extensions: { code: 'NOT_FOUND' } });
      }
      await prisma.friendship.update({ where: { id: request.id }, data: { status: 'ACCEPTED' } });
      return true;
    },
  }),
);

builder.mutationField('rejectFriendRequest', (t) =>
  t.boolean({
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      requireAuth(ctx.userId);
      const request = await prisma.friendship.findFirst({
        where: { id: String(id), receiverId: ctx.userId, status: 'PENDING' },
      });
      if (!request) {
        throw new GraphQLError('Richiesta non trovata.', { extensions: { code: 'NOT_FOUND' } });
      }
      await prisma.friendship.update({ where: { id: request.id }, data: { status: 'REJECTED' } });
      return true;
    },
  }),
);

builder.mutationField('removeFriend', (t) =>
  t.boolean({
    args: { userId: t.arg.id({ required: true }) },
    resolve: async (_root, { userId }, ctx) => {
      requireAuth(ctx.userId);
      const otherId = String(userId);
      const friendship = await prisma.friendship.findFirst({
        where: {
          status: 'ACCEPTED',
          OR: [
            { senderId: ctx.userId, receiverId: otherId },
            { senderId: otherId, receiverId: ctx.userId },
          ],
        },
      });
      if (!friendship) {
        throw new GraphQLError('Amico non trovato.', { extensions: { code: 'NOT_FOUND' } });
      }
      // elimino il record: l'amicizia potrà essere richiesta di nuovo in futuro
      await prisma.friendship.delete({ where: { id: friendship.id } });
      return true;
    },
  }),
);
