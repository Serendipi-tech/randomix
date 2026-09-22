import { useQuery } from '@apollo/client';
import { ItemQueries } from '@randomix/graphql-schema';

const { ITEM_RATINGS } = ItemQueries;

export interface ReviewUser {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface Review {
  id: string;
  value: number;
  note: string | null;
  updatedAt: string;
  user: ReviewUser | null;
}

interface ItemRatingsQuery {
  item: {
    id: string;
    averageRating: number | null;
    ratingsCount: number;
    reviews: Review[];
  } | null;
}

/** Media, conteggio ed elenco recensioni (amici prima) di un item: caricati solo quando `enabled`,
 *  così la card/lista non paga il costo di questa query finché la bottomsheet del rating non si apre. */
export function useItemRatings(itemId: string | undefined, enabled: boolean) {
  const { data, loading, error } = useQuery<ItemRatingsQuery>(ITEM_RATINGS, {
    variables: { id: itemId },
    skip: !enabled || !itemId,
    fetchPolicy: 'cache-and-network',
  });

  return {
    averageRating: data?.item?.averageRating ?? null,
    ratingsCount: data?.item?.ratingsCount ?? 0,
    reviews: data?.item?.reviews ?? [],
    loading,
    error,
  };
}
