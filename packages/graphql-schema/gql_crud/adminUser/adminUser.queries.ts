import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const ADMIN_USERS: DocumentNode = parse(`
  query AdminUsers($search: String, $limit: Int, $cursor: String) {
    adminUsers(search: $search, limit: $limit, cursor: $cursor) {
      users {
        id
        username
        email
        role
        deletedAt
        createdAt
      }
      nextCursor
    }
  }
`);

export const ADMIN_USER: DocumentNode = parse(`
  query AdminUser($id: ID!) {
    adminUser(id: $id) {
      id
      username
      email
      avatarUrl
      role
      deletedAt
      createdAt
      membershipPlan
      listsCount
      groupsCount
      friendsCount
      payments {
        id
        amount
        status
        createdAt
      }
    }
  }
`);
