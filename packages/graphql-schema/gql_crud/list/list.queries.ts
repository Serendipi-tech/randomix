import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const LIST_DETAIL: DocumentNode = parse(`
  query ListDetail($id: ID!) {
    list(id: $id) {
      id
      name
      icon
      color
      description
      isHidden
      categories {
        id
        name
        icon
      }
      items {
        id
        count
        skippedCount
        acceptedCount
        userItem {
          id
          description
          note
          status
          isHidden
          item {
            id
            name
            description
            imageUrl
            category
          }
        }
      }
    }
  }
`);

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
