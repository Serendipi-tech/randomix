import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const DRAW_FROM_LIST: DocumentNode = parse(`
  mutation DrawFromList($listId: ID!, $previousEntryId: ID) {
    drawFromList(listId: $listId, previousEntryId: $previousEntryId) {
      id
      count
      skippedCount
      acceptedCount
      userItem {
        id
        description
        note
        status
        tags {
          id
          name
          color
        }
        item {
          id
          name
          description
          imageUrl
          category
          myRating {
            id
            value
          }
        }
      }
    }
  }
`);

export const ACCEPT_DRAW: DocumentNode = parse(`
  mutation AcceptDraw($entryId: ID!) {
    acceptDraw(entryId: $entryId) {
      id
      count
      skippedCount
      acceptedCount
    }
  }
`);
