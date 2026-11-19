import { useQuery } from '@apollo/client';
import { ListCategoryQueries } from '@randomix/graphql-schema';
import type { Category } from './useCategories';

const { LIST_CATEGORIES } = ListCategoryQueries;

export interface ListCategory {
  id: string;
  name: string;
  nameEn: string | null;
  description: string | null;
  icon: string;
  includedCategories: Category[];
}

interface ListCategoriesQuery {
  listCategories: ListCategory[];
}

// L'app mobile mostra sempre l'inglese (i18n fisso su 'en'): fallback su `name` se manca la traduzione.
function resolveDisplayName(category: ListCategory): ListCategory {
  return {
    ...category,
    name: category.nameEn ?? category.name,
    includedCategories: category.includedCategories.map((c) => ({ ...c, name: c.nameEn ?? c.name })),
  };
}

export function useListCategories() {
  const { data, loading, error } = useQuery<ListCategoriesQuery>(LIST_CATEGORIES, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    categories: (data?.listCategories ?? []).map(resolveDisplayName),
    loading,
    error: error ?? null,
  };
}
