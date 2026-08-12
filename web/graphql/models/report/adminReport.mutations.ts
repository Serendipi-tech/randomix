import { builder, prisma } from '../../builder';
import { requireAdmin } from '../../auth';
import { StatusReportEnum } from '../../enum';
import './index';

builder.mutationField('adminUpdateReportStatus', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      id: t.arg.id({ required: true }),
      status: t.arg({ type: StatusReportEnum, required: true }),
    },
    resolve: async (_root, { id, status }, ctx) => {
      await requireAdmin(ctx);
      await prisma.report.update({ where: { id: String(id) }, data: { status } });
      return true;
    },
  }),
);
