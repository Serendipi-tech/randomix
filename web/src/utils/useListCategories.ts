'use client';

import { useQuery } from '@apollo/client';
import { ListCategoryQueries } from '@randomix/graphql-schema';

const { LIST_CATEGORIES } = ListCategoryQueries;

export interface ListCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  includedCategories: string[];
  listsCount: number;
  groupListsCount: number;
}

interface ListCategoriesQueryResult {
  listCategories: ListCategory[];
}

export function useListCategories() {
  const { data, loading, error, refetch } = useQuery<ListCategoriesQueryResult>(LIST_CATEGORIES, {
    fetchPolicy: 'cache-and-network',
  });

  return { categories: data?.listCategories ?? [], loading, error, refetch };
}
