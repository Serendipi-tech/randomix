import { useQuery } from '@apollo/client';
import { CategoryQueries } from '@randomix/graphql-schema';

const { CATEGORIES } = CategoryQueries;

export interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoriesQuery {
  categories: Category[];
}

export function useCategories() {
  const { data, loading, error } = useQuery<CategoriesQuery>(CATEGORIES, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    categories: data?.categories ?? [],
    loading,
    error: error ?? null,
  };
}
