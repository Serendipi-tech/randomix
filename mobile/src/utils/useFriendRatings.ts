import { useQuery } from '@apollo/client';
import { RatingQueries } from '@randomix/graphql-schema';

const { FRIEND_RATINGS_FOR_ITEM } = RatingQueries;

export interface FriendRatingUser {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface FriendRatingInfo {
  id: string;
  value: number;
  note: string | null;
  user: FriendRatingUser | null;
}

interface FriendRatingsForItemQuery {
  friendRatingsForItem: FriendRatingInfo[];
}

// `enabled` evita di interrogare il backend finché il bottomsheet non è aperto (un item per riga della lista)
export function useFriendRatings(userItemId: string | undefined, enabled: boolean) {
  const { data, loading, error } = useQuery<FriendRatingsForItemQuery>(FRIEND_RATINGS_FOR_ITEM, {
    variables: { userItemId: userItemId ?? '' },
    skip: !enabled || !userItemId,
    fetchPolicy: 'cache-and-network',
  });

  return {
    friendRatings: data?.friendRatingsForItem ?? [],
    loading,
    error: error ?? null,
  };
}
