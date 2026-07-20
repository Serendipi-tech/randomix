import { useMutation, useQuery } from '@apollo/client';
import { GroupMutations, GroupQueries } from '@randomix/graphql-schema';

const { GROUP_LIST_MERGED_ITEMS } = GroupQueries;
const {
  DRAW_FROM_GROUP_LIST,
  ACCEPT_GROUP_DRAW,
  ADD_LIST_TO_GROUP_LIST,
  REMOVE_LIST_FROM_GROUP_LIST,
} = GroupMutations;

export interface GroupListItem {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: string;
}

interface MergedItemsQuery {
  groupListMergedItems: GroupListItem[];
}

export function useGroupListMergedItems(groupListId: string) {
  const { data, loading, error, refetch } = useQuery<MergedItemsQuery>(GROUP_LIST_MERGED_ITEMS, {
    variables: { groupListId },
    fetchPolicy: 'cache-and-network',
  });

  return {
    items: data?.groupListMergedItems ?? [],
    loading,
    error: error ?? null,
    refetch,
  };
}

export function useGroupListDraw(groupListId: string) {
  const [drawMutate, { loading: drawing, data: drawData, reset: resetDraw }] =
    useMutation<{ drawFromGroupList: GroupListItem }>(DRAW_FROM_GROUP_LIST);

  const [acceptMutate, { loading: accepting }] = useMutation(ACCEPT_GROUP_DRAW, {
    refetchQueries: ['GroupListMergedItems'],
  });

  const draw = (previousItemId?: string) =>
    drawMutate({ variables: { groupListId, previousItemId: previousItemId ?? null } });

  const acceptDraw = (itemId: string) =>
    acceptMutate({ variables: { groupListId, itemId } });

  return {
    draw,
    drawing,
    drawnItem: drawData?.drawFromGroupList ?? null,
    resetDraw,
    acceptDraw,
    accepting,
  };
}

export function useGroupListManage(groupListId: string) {
  const [addMutate, { loading: adding }] = useMutation(ADD_LIST_TO_GROUP_LIST, {
    refetchQueries: ['GroupDetail', 'GroupListMergedItems'],
  });

  const [removeMutate, { loading: removing }] = useMutation(REMOVE_LIST_FROM_GROUP_LIST, {
    refetchQueries: ['GroupDetail', 'GroupListMergedItems'],
  });

  const addList = (listId: string) => addMutate({ variables: { groupListId, listId } });
  const removeList = (listId: string) => removeMutate({ variables: { groupListId, listId } });

  return { addList, adding, removeList, removing };
}
