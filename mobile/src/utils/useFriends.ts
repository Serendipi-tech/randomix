import { useMutation, useQuery } from '@apollo/client';
import { FriendshipMutations, FriendshipQueries } from '@randomix/graphql-schema';

const { MY_FRIENDS } = FriendshipQueries;
const { REMOVE_FRIEND } = FriendshipMutations;

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

export function useRemoveFriend() {
  const [mutate, { loading, error }] = useMutation(REMOVE_FRIEND, {
    refetchQueries: ['MyFriends'],
  });

  const removeFriend = (userId: string) => mutate({ variables: { userId } });

  return { removeFriend, removing: loading, error: error ?? null };
}
