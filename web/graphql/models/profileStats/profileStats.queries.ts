import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import { ProfileStatsRef, type ProfileStatsShape } from './index';

function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

interface CategoryAccumulator {
  name: string;
  icon: string;
  itemsCount: number;
  drawCount: number;
}

builder.queryField('profileStats', (t) =>
  t.field({
    type: ProfileStatsRef,
    resolve: async (_root, _args, ctx): Promise<ProfileStatsShape> => {
      requireAuth(ctx.userId);
      const userId = ctx.userId;

      const [items, listUserItems, notStarted, inProgress, completed, drawAgg] = await Promise.all([
        prisma.user_Item.findMany({
          where: { userId },
          select: { categoryId: true, category: { select: { name: true, icon: true } } },
        }),
        prisma.list_UserItem.findMany({
          where: { userItem: { userId } },
          select: { count: true, userItem: { select: { categoryId: true, category: { select: { name: true, icon: true } } } } },
        }),
        prisma.user_Item.count({ where: { userId, status: 'NOT_STARTED' } }),
        prisma.user_Item.count({ where: { userId, status: 'IN_PROGRESS' } }),
        prisma.user_Item.count({ where: { userId, status: 'COMPLETED' } }),
        prisma.list_UserItem.aggregate({
          where: { userItem: { userId } },
          _sum: { acceptedCount: true, skippedCount: true },
        }),
      ]);

      // aggrego in memoria: dataset per-utente, limitato dall'uso reale dell'app
      const byCategory = new Map<string, CategoryAccumulator>();
      for (const item of items) {
        const entry = byCategory.get(item.categoryId) ?? {
          name: item.category.name,
          icon: item.category.icon,
          itemsCount: 0,
          drawCount: 0,
        };
        entry.itemsCount += 1;
        byCategory.set(item.categoryId, entry);
      }
      for (const row of listUserItems) {
        const { categoryId, category } = row.userItem;
        const entry = byCategory.get(categoryId) ?? {
          name: category.name,
          icon: category.icon,
          itemsCount: 0,
          drawCount: 0,
        };
        entry.drawCount += row.count;
        byCategory.set(categoryId, entry);
      }

      const categoryStats = Array.from(byCategory.entries())
        .map(([categoryId, v]) => ({ categoryId, ...v }))
        .sort((a, b) => b.itemsCount - a.itemsCount);

      return {
        categoryStats,
        completionBreakdown: { notStarted, inProgress, completed },
        drawAcceptance: {
          accepted: drawAgg._sum.acceptedCount ?? 0,
          skipped: drawAgg._sum.skippedCount ?? 0,
        },
      };
    },
  }),
);
