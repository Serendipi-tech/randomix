import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import { requireAdmin } from '../../auth';

// senderId null (non l'id dell'admin): Notification ha @@unique([senderId, receiverId, groupId]) e
// Postgres tratta NULL come sempre distinto nei vincoli unique, quindi invii ripetuti allo stesso
// utente restano validi. Semanticamente coerente: è una notifica di sistema, non da un admin specifico.
builder.mutationField('adminSendBroadcastNotification', (t) =>
  t.int({
    args: {
      title: t.arg.string({ required: true }),
      body: t.arg.string({ required: false }),
    },
    resolve: async (_root, { title, body }, ctx) => {
      await requireAdmin(ctx);
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        throw new GraphQLError('Il titolo è obbligatorio.', { extensions: { code: 'BAD_REQUEST' } });
      }

      const activeUsers = await prisma.user.findMany({ where: { deletedAt: null }, select: { id: true } });

      const result = await prisma.notification.createMany({
        data: activeUsers.map((user) => ({
          title: trimmedTitle,
          body: body ?? null,
          notificationType: 'SYSTEM' as const,
          senderId: null,
          receiverId: user.id,
        })),
      });

      return result.count;
    },
  }),
);
