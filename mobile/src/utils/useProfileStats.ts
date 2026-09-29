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

export interface DrawAcceptance {
  accepted: number;
  skipped: number;
}

interface ProfileStatsQuery {
  profileStats: {
    categoryStats: CategoryStat[];
    completionBreakdown: CompletionBreakdown;
    drawAcceptance: DrawAcceptance;
  };
}

export function useProfileStats() {
  const { data, loading, error } = useQuery<ProfileStatsQuery>(PROFILE_STATS, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    categoryStats: data?.profileStats.categoryStats ?? [],
    completionBreakdown: data?.profileStats.completionBreakdown ?? null,
    drawAcceptance: data?.profileStats.drawAcceptance ?? null,
    loading,
    error: error ?? null,
  };
}
