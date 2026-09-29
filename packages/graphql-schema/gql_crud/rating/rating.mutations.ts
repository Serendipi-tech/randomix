import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const RATE_ITEM: DocumentNode = parse(`
  mutation RateItem($userItemId: ID!, $value: Int!, $note: String) {
    rateItem(userItemId: $userItemId, value: $value, note: $note) {
      id
      value
      note
    }
  }
`);

export const DELETE_RATING: DocumentNode = parse(`
  mutation DeleteRating($userItemId: ID!) {
    deleteRating(userItemId: $userItemId)
  }
`);
