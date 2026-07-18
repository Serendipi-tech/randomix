import { useMutation, useQuery } from '@apollo/client';
import { FriendshipMutations, FriendshipQueries } from '@randomix/graphql-schema';
import type { Friend } from '@/utils/useFriends';

const { FRIEND_REQUESTS } = FriendshipQueries;
const { ACCEPT_FRIEND_REQUEST, REJECT_FRIEND_REQUEST } = FriendshipMutations;

export interface FriendRequest {
  id: string;
  sender: Friend;
}

interface FriendRequestsQuery {
  friendRequests: FriendRequest[];
}

// accettare/rifiutare cambia sia le richieste sia la lista amici
const REFETCH_ON_ANSWER = ['FriendRequests', 'MyFriends'];

export function useFriendRequests() {
  const { data, loading, error } = useQuery<FriendRequestsQuery>(FRIEND_REQUESTS, {
    fetchPolicy: 'cache-and-network',
  });

  const [acceptMutation, { loading: accepting }] = useMutation(ACCEPT_FRIEND_REQUEST, {
    refetchQueries: REFETCH_ON_ANSWER,
  });
  const [rejectMutation, { loading: rejecting }] = useMutation(REJECT_FRIEND_REQUEST, {
    refetchQueries: REFETCH_ON_ANSWER,
  });

  const acceptRequest = (id: string) => acceptMutation({ variables: { id } });
  const rejectRequest = (id: string) => rejectMutation({ variables: { id } });

  return {
    requests: data?.friendRequests ?? [],
    loading,
    error: error ?? null,
    acceptRequest,
    rejectRequest,
    answering: accepting || rejecting,
  };
}
