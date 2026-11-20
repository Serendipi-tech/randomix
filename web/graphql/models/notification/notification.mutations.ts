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
