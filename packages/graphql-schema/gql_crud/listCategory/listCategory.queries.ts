import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const LIST_CATEGORIES: DocumentNode = parse(`
  query ListCategories {
    listCategories {
      id
      name
      description
      icon
      includedCategories
    }
  }
`);
