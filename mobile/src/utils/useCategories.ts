import { useQuery } from '@apollo/client';
import { CategoryQueries } from '@randomix/graphql-schema';

const { CATEGORIES } = CategoryQueries;

export interface Category {
  id: string;
  name: string;
  nameEn: string | null;
  icon: string;
}

interface CategoriesQuery {
  categories: Category[];
}

// L'app mobile mostra sempre l'inglese (i18n fisso su 'en'): fallback su `name` se manca la traduzione.
function resolveDisplayName(category: Category): Category {
  return { ...category, name: category.nameEn ?? category.name };
}

export function useCategories() {
  const { data, loading, error } = useQuery<CategoriesQuery>(CATEGORIES, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    categories: (data?.categories ?? []).map(resolveDisplayName),
    loading,
    error: error ?? null,
  };
}
