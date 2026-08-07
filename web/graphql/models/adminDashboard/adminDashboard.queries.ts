import { builder, prisma } from '../../builder';
import { requireAdmin } from '../../auth';
import { AdminDashboardStatsRef } from './index';
import './index';

const GROWTH_WINDOW_DAYS = 30;

builder.queryField('adminDashboardStats', (t) =>
  t.field({
    type: AdminDashboardStatsRef,
    resolve: async (_root, _args, ctx) => {
      await requireAdmin(ctx);

      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - (GROWTH_WINDOW_DAYS - 1));

      const [totalUsers, usersBeforeWindow, recentUsers, totalLists, totalGroups, totalGroupMemberships, activeSubscriptions] =
        await Promise.all([
          prisma.user.count(),
          prisma.user.count({ where: { createdAt: { lt: startDate } } }),
          prisma.user.findMany({ where: { createdAt: { gte: startDate } }, select: { createdAt: true } }),
          prisma.list.count(),
          prisma.group.count(),
          prisma.group_User.count(),
          prisma.subscription.findMany({
            where: { status: 'ACTIVE' },
            select: { userId: true, membership: { select: { plan: true } } },
            distinct: ['userId'],
          }),
        ]);

      // Bucket per giorno (finestra fissa) poi cumulativo a partire dagli utenti precedenti alla finestra
      const dayBuckets = new Map<string, number>();
      for (let i = 0; i < GROWTH_WINDOW_DAYS; i++) {
        const day = new Date(startDate);
        day.setDate(day.getDate() + i);
        dayBuckets.set(day.toISOString().slice(0, 10), 0);
      }
      recentUsers.forEach((u) => {
        const key = u.createdAt.toISOString().slice(0, 10);
        dayBuckets.set(key, (dayBuckets.get(key) ?? 0) + 1);
      });

      let cumulative = usersBeforeWindow;
      const usersGrowth = Array.from(dayBuckets.entries()).map(([key, count]) => {
        cumulative += count;
        return { date: new Date(key), totalUsers: cumulative };
      });

      // Utenti senza abbonamento attivo confluiscono nel bucket FREE
      const planCounts = new Map<string, number>();
      activeSubscriptions.forEach((sub) => {
        const plan = sub.membership.plan;
        planCounts.set(plan, (planCounts.get(plan) ?? 0) + 1);
      });
      const usersWithoutActivePlan = totalUsers - activeSubscriptions.length;
      planCounts.set('FREE', (planCounts.get('FREE') ?? 0) + usersWithoutActivePlan);
      const usersByMembershipPlan = Array.from(planCounts.entries()).map(([plan, count]) => ({ plan, count }));

      return {
        totalUsers,
        usersGrowth,
        usersByMembershipPlan,
        avgListsPerUser: totalUsers > 0 ? totalLists / totalUsers : 0,
        avgGroupsPerUser: totalUsers > 0 ? totalGroupMemberships / totalUsers : 0,
        avgUsersPerGroup: totalGroups > 0 ? totalGroupMemberships / totalGroups : 0,
      };
    },
  }),
);
