import { builder, prisma } from '../../builder';
import { requireAdmin } from '../../auth';
import { FeedbackStatusEnum } from '../../enum';
import './index';

builder.mutationField('updateFeedbackStatus', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      id: t.arg.id({ required: true }),
      status: t.arg({ type: FeedbackStatusEnum, required: true }),
    },
    resolve: async (_root, { id, status }, ctx) => {
      await requireAdmin(ctx);
      await prisma.userFeedback.update({ where: { id: String(id) }, data: { status } });
      return true;
    },
  }),
);

builder.mutationField('updateFeedbackSeen', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      id: t.arg.id({ required: true }),
      seen: t.arg.boolean({ required: true }),
    },
    resolve: async (_root, { id, seen }, ctx) => {
      await requireAdmin(ctx);
      await prisma.userFeedback.update({ where: { id: String(id) }, data: { seen } });
      return true;
    },
  }),
);

builder.mutationField('updateFeedbackImportant', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      id: t.arg.id({ required: true }),
      isImportant: t.arg.boolean({ required: true }),
    },
    resolve: async (_root, { id, isImportant }, ctx) => {
      await requireAdmin(ctx);
      await prisma.userFeedback.update({ where: { id: String(id) }, data: { isImportant } });
      return true;
    },
  }),
);

builder.mutationField('updateFeedbackNote', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      id: t.arg.id({ required: true }),
      adminNote: t.arg.string({ required: false }),
    },
    resolve: async (_root, { id, adminNote }, ctx) => {
      await requireAdmin(ctx);
      await prisma.userFeedback.update({ where: { id: String(id) }, data: { adminNote: adminNote ?? null } });
      return true;
    },
  }),
);
