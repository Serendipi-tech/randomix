import { useQuery } from '@apollo/client';
import { ListQueries } from '@randomix/graphql-schema';

const { MY_LISTS } = ListQueries;

export interface UserList {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string | null;
  updatedAt: string;
}

interface MyListsPayload {
  lists: UserList[];
  nextCursor: string | null;
}

interface MyListsQuery {
  myLists: MyListsPayload;
}

const PAGE_SIZE = 20;

export function useMyLists() {
  const { data, loading, error, fetchMore, refetch } = useQuery<MyListsQuery>(MY_LISTS, {
    variables: { limit: PAGE_SIZE },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const lists = data?.myLists.lists ?? [];
  const nextCursor = data?.myLists.nextCursor ?? null;

  const loadMore = async () => {
    if (!nextCursor || loading) return;
    await fetchMore({
      variables: { limit: PAGE_SIZE, cursor: nextCursor },
      // accodo la pagina successiva a quelle già in cache
      updateQuery: (prev, { fetchMoreResult }) => ({
        myLists: {
          ...fetchMoreResult.myLists,
          lists: [...prev.myLists.lists, ...fetchMoreResult.myLists.lists],
        },
      }),
    });
  };

  return {
    lists,
    hasMore: nextCursor != null,
    loading,
    error: error ?? null,
    loadMore,
    refetch,
  };
}
