'use client';

import { useQuery } from '@apollo/client';
import { AdminTagQueries } from '@randomix/graphql-schema';

const { ADMIN_TAG_GROUPS } = AdminTagQueries;

export interface TagColorCount {
  color: string;
  count: number;
}

export interface AdminTagGroup {
  name: string;
  personalCount: number;
  distinctUsersCount: number;
  totalItemsCount: number;
  colors: TagColorCount[];
  existingSystemTagId: string | null;
}

interface AdminTagGroupsQueryResult {
  adminTagGroups: AdminTagGroup[];
}

export function useTagGroups() {
  const { data, loading, error, refetch } = useQuery<AdminTagGroupsQueryResult>(ADMIN_TAG_GROUPS, {
    fetchPolicy: 'cache-and-network',
  });

  return { groups: data?.adminTagGroups ?? [], loading, error, refetch };
}
