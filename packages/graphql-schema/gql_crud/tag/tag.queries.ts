import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const MY_TAGS: DocumentNode = parse(`
  query MyTags {
    myTags {
      id
      name
      color
      isSystem
    }
  }
`);
