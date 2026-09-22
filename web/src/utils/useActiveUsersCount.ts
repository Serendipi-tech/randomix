'use client';

import { useQuery } from '@apollo/client';
import { AdminNotificationQueries } from '@randomix/graphql-schema';

const { ADMIN_ACTIVE_USERS_COUNT } = AdminNotificationQueries;

interface AdminActiveUsersCountQueryResult {
  adminActiveUsersCount: number;
}

export function useActiveUsersCount() {
  const { data, loading } = useQuery<AdminActiveUsersCountQueryResult>(ADMIN_ACTIVE_USERS_COUNT, {
    fetchPolicy: 'cache-and-network',
  });

  return { count: data?.adminActiveUsersCount ?? 0, loading };
}
