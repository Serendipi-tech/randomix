import { useMutation, useQuery } from '@apollo/client';
import { GroupMutations, GroupQueries } from '@randomix/graphql-schema';

const { MY_GROUPS } = GroupQueries;
const { CREATE_GROUP, DELETE_GROUP } = GroupMutations;

export interface GroupSummary {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  memberCount: number;
  myRole: string;
  createdAt: string;
  updatedAt: string;
}

interface MyGroupsQuery {
  myGroups: GroupSummary[];
}

export function useMyGroups() {
  const { data, loading, error, refetch } = useQuery<MyGroupsQuery>(MY_GROUPS, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    groups: data?.myGroups ?? [],
    loading,
    error: error ?? null,
    refetch,
  };
}

export function useCreateGroup() {
  const [mutate, { loading, error }] = useMutation(CREATE_GROUP, {
    refetchQueries: ['MyGroups'],
  });

  const createGroup = (name: string, description?: string) =>
    mutate({ variables: { name, description: description ?? null } });

  return { createGroup, creating: loading, error: error ?? null };
}

export function useDeleteGroup() {
  const [mutate, { loading, error }] = useMutation(DELETE_GROUP, {
    refetchQueries: ['MyGroups'],
  });

  const deleteGroup = (groupId: string) => mutate({ variables: { groupId } });

  return { deleteGroup, deleting: loading, error: error ?? null };
}
