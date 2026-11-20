import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import { NotificationRef } from './index';

function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

// GROUP_INVITE ha già una UI dedicata (myGroupInvites/accept-rejectGroupInvite nella tab Gruppi),
// quindi è esclusa qui per non duplicare azioni che vivono altrove.
builder.queryField('myNotifications', (t) =>
  t.field({
    type: [NotificationRef],
    resolve: async (_root, _args, ctx) => {
      requireAuth(ctx.userId);
      return prisma.notification.findMany({
        where: { receiverId: ctx.userId, notificationType: { not: 'GROUP_INVITE' } },
        include: { sender: true },
        orderBy: { createdAt: 'desc' },
      });
    },
  }),
);
