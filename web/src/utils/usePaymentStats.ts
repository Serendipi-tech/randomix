'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { AdminPaymentQueries } from '@randomix/graphql-schema';

const { ADMIN_PAYMENT_STATS } = AdminPaymentQueries;

export const PAYMENT_STATS_PERIODS = [7, 30, 90] as const;
export type PaymentStatsPeriod = (typeof PAYMENT_STATS_PERIODS)[number];

interface PaymentsByStatus {
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  count: number;
}

interface RevenuePoint {
  date: string;
  totalAmount: number;
}

interface AdminPaymentStats {
  totalRevenue: number;
  paymentsByStatus: PaymentsByStatus[];
  revenueByDay: RevenuePoint[];
}

interface AdminPaymentStatsQueryResult {
  adminPaymentStats: AdminPaymentStats;
}

export function usePaymentStats() {
  const [days, setDays] = useState<PaymentStatsPeriod>(30);

  const { data, loading, error } = useQuery<AdminPaymentStatsQueryResult>(ADMIN_PAYMENT_STATS, {
    variables: { days },
    fetchPolicy: 'cache-and-network',
  });

  return { days, setDays, stats: data?.adminPaymentStats ?? null, loading, error };
}
