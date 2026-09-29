import { useQuery } from '@apollo/client';
import { ListCategoryQueries } from '@randomix/graphql-schema';
import type { Category } from './useCategories';

const { LIST_CATEGORIES } = ListCategoryQueries;

export interface ListCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  includedCategories: Category[];
}

interface ListCategoriesQuery {
  listCategories: ListCategory[];
}

export function useListCategories() {
  const { data, loading, error } = useQuery<ListCategoriesQuery>(LIST_CATEGORIES, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    categories: data?.listCategories ?? [],
    loading,
    error: error ?? null,
  };
}
