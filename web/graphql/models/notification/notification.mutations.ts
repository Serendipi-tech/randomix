import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import './index';

function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

builder.mutationField('markNotificationAsRead', (t) =>
  t.boolean({
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      requireAuth(ctx.userId);
      const notif = await prisma.notification.findFirst({
        where: { id: String(id), receiverId: ctx.userId },
      });
      if (!notif) {
        throw new GraphQLError('Notifica non trovata.', { extensions: { code: 'NOT_FOUND' } });
      }
      await prisma.notification.update({ where: { id: notif.id }, data: { markedAsRead: true } });
      return true;
    },
  }),
);

// Solo le notifiche di sistema si eliminano: le altre nascono da un'azione fra utenti (amicizie,
// gruppi, sfide) e si chiudono rispondendo, non cancellandole.
builder.mutationField('deleteNotification', (t) =>
  t.boolean({
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      requireAuth(ctx.userId);
      const notif = await prisma.notification.findFirst({
        where: { id: String(id), receiverId: ctx.userId, notificationType: 'SYSTEM' },
      });
      if (!notif) {
        throw new GraphQLError('Notifica non trovata.', { extensions: { code: 'NOT_FOUND' } });
      }
      await prisma.notification.delete({ where: { id: notif.id } });
      return true;
    },
  }),
);
