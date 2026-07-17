import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const MY_FRIENDS: DocumentNode = parse(`
  query MyFriends {
    myFriends {
      id
      username
      avatarUrl
    }
  }
`);
