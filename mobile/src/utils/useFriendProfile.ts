import { useQuery } from '@apollo/client';
import { FriendshipQueries } from '@randomix/graphql-schema';
import type { Friend } from '@/utils/useFriends';

const { FRIEND_PROFILE } = FriendshipQueries;

export interface FriendList {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string | null;
  itemCount: number;
}

interface FriendProfileQuery {
  friendProfile: {
    user: Friend;
    lists: FriendList[];
  };
}

export function useFriendProfile(userId: string | undefined) {
  const { data, loading, error } = useQuery<FriendProfileQuery>(FRIEND_PROFILE, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });

  return {
    profile: data?.friendProfile ?? null,
    loading,
    error: error ?? null,
  };
}
