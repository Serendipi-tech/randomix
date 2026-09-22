'use client';

import { useQuery } from '@apollo/client';
import { AdminNotificationQueries } from '@randomix/graphql-schema';

const { ADMIN_BROADCAST_HISTORY } = AdminNotificationQueries;

export interface BroadcastHistoryEntry {
  title: string;
  body: string | null;
  sentAt: string;
  recipientCount: number;
}

interface AdminBroadcastHistoryQueryResult {
  adminBroadcastHistory: BroadcastHistoryEntry[];
}

export function useBroadcastHistory() {
  const { data, loading, refetch } = useQuery<AdminBroadcastHistoryQueryResult>(ADMIN_BROADCAST_HISTORY, {
    fetchPolicy: 'cache-and-network',
  });

  return { history: data?.adminBroadcastHistory ?? [], loading, refetch };
}
