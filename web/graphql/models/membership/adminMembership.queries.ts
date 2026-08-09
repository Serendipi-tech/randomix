import { builder, prisma } from '../../builder';
import { requireAdmin } from '../../auth';
import './index';

builder.queryField('adminMemberships', (t) =>
  t.prismaField({
    type: ['Membership'],
    resolve: async (query, _root, _args, ctx) => {
      await requireAdmin(ctx);
      return prisma.membership.findMany({ ...query, where: { deletedAt: null }, orderBy: { plan: 'asc' } });
    },
  }),
);
