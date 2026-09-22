import { useQuery } from '@apollo/client';
import { ListQueries } from '@randomix/graphql-schema';
import type { ListCategory } from './useListCategories';
import type { Category } from './useCategories';

const { LIST_DETAIL } = ListQueries;

export type CompletionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface RatingInfo {
  id: string;
  value: number;
  note: string | null;
}

export interface TagInfo {
  id: string;
  name: string;
  color: string;
}

export interface UserItem {
  id: string;
  name: string;
  description: string | null;
  note: string | null;
  status: CompletionStatus;
  isHidden: boolean;
  tags: TagInfo[];
  category: Category;
  rating: RatingInfo | null;
}

export interface ListItemEntry {
  id: string;
  count: number;
  skippedCount: number;
  acceptedCount: number;
  userItem: UserItem;
}

export interface ListDetail {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string | null;
  isHidden: boolean;
  categories: Pick<ListCategory, 'id' | 'name' | 'icon'>[];
  items: ListItemEntry[];
}

interface ListDetailQuery {
  list: ListDetail | null;
}

export function useListDetail(id?: string) {
  const { data, loading, error, refetch } = useQuery<ListDetailQuery>(LIST_DETAIL, {
    variables: { id: id ?? '' },
    fetchPolicy: 'cache-and-network',
    // in modalità creazione non c'è nessuna lista da caricare
    skip: !id,
  });

  return {
    list: data?.list ?? null,
    loading,
    error: error ?? null,
    refetch,
  };
}
