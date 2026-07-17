import { useQuery } from '@apollo/client';
import { FriendshipQueries } from '@randomix/graphql-schema';

const { MY_FRIENDS } = FriendshipQueries;

export interface Friend {
  id: string;
  username: string;
  avatarUrl: string | null;
}

interface MyFriendsQuery {
  myFriends: Friend[];
}

export function useMyFriends() {
  const { data, loading, error, refetch } = useQuery<MyFriendsQuery>(MY_FRIENDS, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    friends: data?.myFriends ?? [],
    loading,
    error: error ?? null,
    refetch,
  };
}
