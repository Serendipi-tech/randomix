import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const FRIEND_RATINGS_FOR_ITEM: DocumentNode = parse(`
  query FriendRatingsForItem($userItemId: ID!) {
    friendRatingsForItem(userItemId: $userItemId) {
      id
      value
      note
      user {
        id
        username
        avatarUrl
      }
    }
  }
`);
