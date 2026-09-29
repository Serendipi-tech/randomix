'use client';

import { useQuery } from '@apollo/client';
import { CategoryQueries } from '@randomix/graphql-schema';

const { CATEGORIES } = CategoryQueries;

export interface Category {
  id: string;
  name: string;
  icon: string;
  itemsCount: number;
  listCategoriesCount: number;
}

interface CategoriesQueryResult {
  categories: Category[];
}

export function useCategories() {
  const { data, loading, error, refetch } = useQuery<CategoriesQueryResult>(CATEGORIES, {
    fetchPolicy: 'cache-and-network',
  });

  return { categories: data?.categories ?? [], loading, error, refetch };
}
