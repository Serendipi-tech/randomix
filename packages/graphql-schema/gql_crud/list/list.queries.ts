import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const MY_LISTS: DocumentNode = parse(`
  query MyLists($limit: Int, $cursor: String) {
    myLists(limit: $limit, cursor: $cursor) {
      lists {
        id
        name
        icon
        color
        description
        updatedAt
      }
      nextCursor
    }
  }
`);
