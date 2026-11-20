import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const MY_NOTIFICATIONS: DocumentNode = parse(`
  query MyNotifications {
    myNotifications {
      id
      title
      body
      notificationType
      markedAsRead
      sender {
        id
        username
        avatarUrl
      }
      createdAt
    }
  }
`);
