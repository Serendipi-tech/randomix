import { useMutation, useQuery } from '@apollo/client';
import { GroupMutations, GroupQueries } from '@randomix/graphql-schema';

const { GROUP_LIST_SHARED_LIST_IDS } = GroupQueries;
const { ADD_LIST_TO_GROUP_LIST, REMOVE_LIST_FROM_GROUP_LIST } = GroupMutations;

// useGroupListMergedItems e useGroupListDraw rimossi: dipendevano dal catalogo Item condiviso,
// disabilitato insieme al model (vedi item.prisma). Gruppi/Challenge sono da rifare (SUBROAD).

export function useGroupListSharedListIds(groupListId: string) {
  const { data, loading, error } = useQuery<{ groupListSharedListIds: string[] }>(
    GROUP_LIST_SHARED_LIST_IDS,
    { variables: { groupListId }, fetchPolicy: 'cache-and-network' },
  );

  return { sharedIds: data?.groupListSharedListIds ?? [], loading, error: error ?? null };
}

export function useGroupListManage(groupListId: string) {
  const refetchQueries = ['GroupDetail', 'GroupListMergedItems', 'GroupListSharedListIds'];

  const [addMutate, { loading: adding }] = useMutation(ADD_LIST_TO_GROUP_LIST, { refetchQueries });
  const [removeMutate, { loading: removing }] = useMutation(REMOVE_LIST_FROM_GROUP_LIST, {
    refetchQueries,
  });

  const addList = (listId: string) => addMutate({ variables: { groupListId, listId } });
  const removeList = (listId: string) => removeMutate({ variables: { groupListId, listId } });

  return { addList, adding, removeList, removing };
}
