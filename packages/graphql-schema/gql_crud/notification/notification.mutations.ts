import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const MARK_NOTIFICATION_AS_READ: DocumentNode = parse(`
  mutation MarkNotificationAsRead($id: ID!) {
    markNotificationAsRead(id: $id)
  }
`);
