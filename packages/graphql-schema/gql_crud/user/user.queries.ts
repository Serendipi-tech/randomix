import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const ME: DocumentNode = parse(`
  query Me {
    me {
      id
      username
      email
      avatarUrl
      language
      role
      createdAt
    }
  }
`);
