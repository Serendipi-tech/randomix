import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import { requireAdmin } from '../../auth';
import { AdminPaymentStatsRef } from './index';
import './index';

const ALLOWED_PERIODS = [7, 30, 90] as const;

builder.queryField('adminPaymentStats', (t) =>
  t.field({
    type: AdminPaymentStatsRef,
    args: { days: t.arg.int({ required: true }) },
    resolve: async (_root, { days }, ctx) => {
      await requireAdmin(ctx);

      if (!ALLOWED_PERIODS.includes(days as (typeof ALLOWED_PERIODS)[number])) {
        throw new GraphQLError('Periodo non valido: usa 7, 30 o 90 giorni.', { extensions: { code: 'BAD_REQUEST' } });
      }

      // Calcolo interamente in UTC: mischiare confini di giorno locali (setHours/setDate, timezone
      // del server) con etichette UTC (toISOString) sfasa i bucket di un giorno quando il fuso del
      // server non è UTC — i pagamenti "di oggi" finiscono in un bucket randagio invece che nell'ultimo
      // giorno atteso. Anche più robusto per il deploy: i server serverless girano tipicamente in UTC.
      const now = new Date();
      const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (days - 1)));

      const [successPayments, statusCounts, recentPayments] = await Promise.all([
        prisma.payment.aggregate({ where: { status: 'SUCCESS' }, _sum: { amount: true } }),
        prisma.payment.groupBy({ by: ['status'], _count: true }),
        prisma.payment.findMany({
          where: { status: 'SUCCESS', createdAt: { gte: startDate } },
          select: { amount: true, createdAt: true },
        }),
      ]);

      // Bucket per giorno sul periodo scelto (non cumulativo: entrate del singolo giorno, non progressivo)
      const dayBuckets = new Map<string, number>();
      for (let i = 0; i < days; i++) {
        const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (days - 1) + i));
        dayBuckets.set(day.toISOString().slice(0, 10), 0);
      }
      recentPayments.forEach((payment) => {
        const key = payment.createdAt.toISOString().slice(0, 10);
        dayBuckets.set(key, (dayBuckets.get(key) ?? 0) + payment.amount);
      });

      const revenueByDay = Array.from(dayBuckets.entries()).map(([key, totalAmount]) => ({
        date: new Date(key),
        totalAmount,
      }));

      return {
        totalRevenue: successPayments._sum.amount ?? 0,
        paymentsByStatus: statusCounts.map((s) => ({ status: s.status, count: s._count })),
        revenueByDay,
      };
    },
  }),
);
