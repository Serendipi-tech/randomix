'use client';

import { useQuery } from '@apollo/client';
import { AdminDashboardQueries } from '@randomix/graphql-schema';

const { ADMIN_DASHBOARD_STATS } = AdminDashboardQueries;

export interface AdminDashboardStats {
  totalUsers: number;
  usersGrowth: { date: string; totalUsers: number }[];
  usersByMembershipPlan: { plan: string; count: number }[];
  avgListsPerUser: number;
  avgGroupsPerUser: number;
  avgUsersPerGroup: number;
}

interface AdminDashboardStatsQueryResult {
  adminDashboardStats: AdminDashboardStats;
}

export function useAdminDashboardStats() {
  const { data, loading, error } = useQuery<AdminDashboardStatsQueryResult>(ADMIN_DASHBOARD_STATS, {
    fetchPolicy: 'cache-and-network',
  });

  return { stats: data?.adminDashboardStats ?? null, loading, error };
}
