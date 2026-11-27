import { useQuery } from '@apollo/client';
import { ProfileStatsQueries } from '@randomix/graphql-schema';

const { PROFILE_STATS } = ProfileStatsQueries;

export interface CategoryStat {
  categoryId: string;
  name: string;
  icon: string;
  itemsCount: number;
  drawCount: number;
}

export interface CompletionBreakdown {
  notStarted: number;
  inProgress: number;
  completed: number;
}

interface ProfileStatsQuery {
  profileStats: {
    categoryStats: CategoryStat[];
    completionBreakdown: CompletionBreakdown;
  };
}

export function useProfileStats() {
  const { data, loading, error } = useQuery<ProfileStatsQuery>(PROFILE_STATS, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    categoryStats: data?.profileStats.categoryStats ?? [],
    completionBreakdown: data?.profileStats.completionBreakdown ?? null,
    loading,
    error: error ?? null,
  };
}
