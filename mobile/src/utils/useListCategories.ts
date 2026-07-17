import { useQuery } from '@apollo/client';
import { ListCategoryQueries } from '@randomix/graphql-schema';

const { LIST_CATEGORIES } = ListCategoryQueries;

// valori dell'enum CATEGORY del backend, per la scelta manuale della categoria item
export const ITEM_CATEGORIES = [
  'APPS', 'ART', 'BOOKS', 'NOVELS', 'COMICS', 'MANGA', 'SUBJECTS',
  'MOVIES', 'TV_SHOWS', 'MUSIC', 'OTHER_GAMES', 'VIDEOGAMES', 'BOARDGAMES',
  'CARDGAMES', 'SHOPS', 'RESTAURANTS', 'ACTIVITIES', 'SERVICES', 'FOOD',
  'CUISINE', 'TRAVEL', 'FANFICTIONS', 'VIDEOS', 'PODCASTS', 'MAGAZINES',
  'SPORTS', 'EVENTS', 'EDUCATION', 'CINEMA', 'THEATRE', 'EXPERIENCES',
  'BEVERAGES', 'CUSTOM',
] as const;

export type Category = (typeof ITEM_CATEGORIES)[number];

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
