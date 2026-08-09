import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const ADMIN_MEMBERSHIPS: DocumentNode = parse(`
  query AdminMemberships {
    adminMemberships {
      id
      plan
      description
      price
      currency
      billing
      maxLists
      maxItemsPerList
      createdAt
      activeSubscriptionsCount
    }
  }
`);
