import { useMutation, useQuery } from '@apollo/client';
import { GroupMutations, GroupQueries } from '@randomix/graphql-schema';

const { MY_GROUP_INVITES } = GroupQueries;
const { ACCEPT_GROUP_INVITE, REJECT_GROUP_INVITE } = GroupMutations;

export interface GroupInvite {
  id: string;
  groupId: string;
  groupName: string;
  sender: { id: string; username: string; avatarUrl: string | null };
  createdAt: string;
}

interface MyGroupInvitesQuery {
  myGroupInvites: GroupInvite[];
}

export function useGroupInvites() {
  const { data, loading, error, refetch } = useQuery<MyGroupInvitesQuery>(MY_GROUP_INVITES, {
    fetchPolicy: 'cache-and-network',
  });

  const [acceptMutate, { loading: accepting }] = useMutation(ACCEPT_GROUP_INVITE, {
    refetchQueries: ['MyGroupInvites', 'MyGroups'],
  });

  const [rejectMutate, { loading: rejecting }] = useMutation(REJECT_GROUP_INVITE, {
    refetchQueries: ['MyGroupInvites'],
  });

  const acceptInvite = (notificationId: string) =>
    acceptMutate({ variables: { notificationId } });

  const rejectInvite = (notificationId: string) =>
    rejectMutate({ variables: { notificationId } });

  return {
    invites: data?.myGroupInvites ?? [],
    loading,
    error: error ?? null,
    refetch,
    acceptInvite,
    rejectInvite,
    answering: accepting || rejecting,
  };
}
