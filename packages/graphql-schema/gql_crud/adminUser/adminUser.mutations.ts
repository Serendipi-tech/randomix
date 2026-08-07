import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const ADMIN_SET_USER_SUSPENDED: DocumentNode = parse(`
  mutation AdminSetUserSuspended($userId: ID!, $suspended: Boolean!) {
    adminSetUserSuspended(userId: $userId, suspended: $suspended) {
      id
      deletedAt
    }
  }
`);
