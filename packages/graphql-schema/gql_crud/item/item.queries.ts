import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const ITEM_RATINGS: DocumentNode = parse(`
  query ItemRatings($id: ID!) {
    item(id: $id) {
      id
      averageRating
      ratingsCount
      reviews {
        id
        value
        note
        updatedAt
        user {
          id
          username
          avatarUrl
        }
      }
    }
  }
`);
