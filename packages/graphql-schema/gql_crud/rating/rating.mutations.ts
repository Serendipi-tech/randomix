import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const RATE_ITEM: DocumentNode = parse(`
  mutation RateItem($itemId: ID!, $value: Int!, $note: String) {
    rateItem(itemId: $itemId, value: $value, note: $note) {
      id
      value
      note
    }
  }
`);

export const DELETE_RATING: DocumentNode = parse(`
  mutation DeleteRating($itemId: ID!) {
    deleteRating(itemId: $itemId)
  }
`);
