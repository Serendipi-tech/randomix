import { builder, prisma } from '../../builder';
import { requireAdmin } from '../../auth';

interface BroadcastHistoryEntryShape {
  title: string;
  body: string | null;
  sentAt: Date;
  recipientCount: number;
}

const BroadcastHistoryEntryRef = builder.objectRef<BroadcastHistoryEntryShape>('BroadcastHistoryEntry');
BroadcastHistoryEntryRef.implement({
  fields: (t) => ({
    title: t.exposeString('title'),
    body: t.exposeString('body', { nullable: true }),
    sentAt: t.field({ type: 'DateTime', resolve: (entry) => entry.sentAt }),
    recipientCount: t.exposeInt('recipientCount'),
  }),
});

// Ogni broadcast crea N righe Notification (una per destinatario, stesso title/body/createdAt): lo
// storico le raggruppa per ricostruire i singoli invii con il conteggio destinatari.
builder.queryField('adminBroadcastHistory', (t) =>
  t.field({
    type: [BroadcastHistoryEntryRef],
    resolve: async (_root, _args, ctx) => {
      await requireAdmin(ctx);

      const groups = await prisma.notification.groupBy({
        by: ['title', 'body', 'createdAt'],
        where: { senderId: null, notificationType: 'SYSTEM' },
        _count: true,
        orderBy: { createdAt: 'desc' },
      });

      return groups.map((group) => ({
        title: group.title,
        body: group.body,
        sentAt: group.createdAt,
        recipientCount: group._count,
      }));
    },
  }),
);

// Anteprima destinatari per il form di invio (STEP 6, Fase 2).
builder.queryField('adminActiveUsersCount', (t) =>
  t.int({
    resolve: async (_root, _args, ctx) => {
      await requireAdmin(ctx);
      return prisma.user.count({ where: { deletedAt: null } });
    },
  }),
);
