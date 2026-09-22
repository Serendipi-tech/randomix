import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const ADMIN_BROADCAST_HISTORY: DocumentNode = parse(`
  query AdminBroadcastHistory {
    adminBroadcastHistory {
      title
      body
      sentAt
      recipientCount
    }
  }
`);

export const ADMIN_ACTIVE_USERS_COUNT: DocumentNode = parse(`
  query AdminActiveUsersCount {
    adminActiveUsersCount
  }
`);
