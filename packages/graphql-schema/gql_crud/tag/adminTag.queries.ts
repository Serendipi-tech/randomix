import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const ADMIN_TAG_GROUPS: DocumentNode = parse(`
  query AdminTagGroups {
    adminTagGroups {
      name
      personalCount
      distinctUsersCount
      totalItemsCount
      colors {
        color
        count
      }
      existingSystemTagId
    }
  }
`);

export const ADMIN_SYSTEM_TAGS: DocumentNode = parse(`
  query AdminSystemTags {
    adminSystemTags {
      id
      name
      color
      itemsCount
    }
  }
`);
