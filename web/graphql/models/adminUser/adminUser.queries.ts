import { builder, prisma } from '../../builder';
import { requireAdmin } from '../../auth';
import { AdminUserDetailRef, AdminUsersPayloadRef, getAdminUserDetail } from './index';
import './index';

const DEFAULT_PAGE_SIZE = 20;

builder.queryField('adminUsers', (t) =>
  t.field({
    type: AdminUsersPayloadRef,
    args: {
      search: t.arg.string({ required: false }),
      limit: t.arg.int({ required: false }),
      cursor: t.arg.string({ required: false }),
    },
    resolve: async (_root, { search, limit, cursor }, ctx) => {
      await requireAdmin(ctx);

      const take = limit ?? DEFAULT_PAGE_SIZE;
      const where = search
        ? {
            OR: [
              { username: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {};

      // take + 1 per sapere se esiste una pagina successiva senza una count aggiuntiva
      const rows = await prisma.user.findMany({
        where,
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        take: take + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });

      const hasMore = rows.length > take;
      const users = hasMore ? rows.slice(0, take) : rows;

      return {
        users,
        nextCursor: hasMore ? users[users.length - 1].id : null,
      };
    },
  }),
);

builder.queryField('adminUser', (t) =>
  t.field({
    type: AdminUserDetailRef,
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_root, { id }, ctx) => {
      await requireAdmin(ctx);
      return getAdminUserDetail(String(id));
    },
  }),
);
