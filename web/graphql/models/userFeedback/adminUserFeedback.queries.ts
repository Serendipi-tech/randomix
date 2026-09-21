import { builder, prisma } from '../../builder';
import { requireAdmin } from '../../auth';
import { AdminFeedbackRef, toAdminFeedback } from './index';
import './index';

// Nessun parametro, nessuna paginazione: dataset intero, filtri/tab/ricerca sono client-side
// (vedi docs/features/user_feedback/README.md §6 punto 1 per il perché di questa scelta).
builder.queryField('userFeedbacks', (t) =>
  t.field({
    type: [AdminFeedbackRef],
    resolve: async (_root, _args, ctx) => {
      await requireAdmin(ctx);
      const rows = await prisma.userFeedback.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { username: true } } },
      });
      return rows.map(toAdminFeedback);
    },
  }),
);
