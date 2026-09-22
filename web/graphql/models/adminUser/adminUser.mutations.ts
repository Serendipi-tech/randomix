import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import { requireAdmin } from '../../auth';
import { AdminUserDetailRef, getAdminUserDetail } from './index';
import './index';

builder.mutationField('adminSetUserSuspended', (t) =>
  t.field({
    type: AdminUserDetailRef,
    nullable: true,
    args: {
      userId: t.arg.id({ required: true }),
      suspended: t.arg.boolean({ required: true }),
    },
    resolve: async (_root, { userId, suspended }, ctx) => {
      const adminId = await requireAdmin(ctx);
      const targetId = String(userId);

      if (targetId === adminId) {
        throw new GraphQLError('Non puoi sospendere il tuo stesso account.', { extensions: { code: 'FORBIDDEN' } });
      }

      await prisma.user.update({
        where: { id: targetId },
        data: { deletedAt: suspended ? new Date() : null },
      });

      return getAdminUserDetail(targetId);
    },
  }),
);
