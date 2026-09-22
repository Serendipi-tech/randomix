'use client';

import { useQuery } from '@apollo/client';
import { AdminTagQueries } from '@randomix/graphql-schema';

const { ADMIN_SYSTEM_TAGS } = AdminTagQueries;

export interface SystemTag {
  id: string;
  name: string;
  color: string;
  itemsCount: number;
}

interface AdminSystemTagsQueryResult {
  adminSystemTags: SystemTag[];
}

export function useSystemTags() {
  const { data, loading, error, refetch } = useQuery<AdminSystemTagsQueryResult>(ADMIN_SYSTEM_TAGS, {
    fetchPolicy: 'cache-and-network',
  });

  return { tags: data?.adminSystemTags ?? [], loading, error, refetch };
}
