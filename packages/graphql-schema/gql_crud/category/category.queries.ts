import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const CATEGORIES: DocumentNode = parse(`
  query Categories {
    categories {
      id
      name
      nameEn
      icon
      itemsCount
      listCategoriesCount
    }
  }
`);
