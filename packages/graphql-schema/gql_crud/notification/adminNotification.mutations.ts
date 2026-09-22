import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const ADMIN_SEND_BROADCAST_NOTIFICATION: DocumentNode = parse(`
  mutation AdminSendBroadcastNotification($title: String!, $body: String) {
    adminSendBroadcastNotification(title: $title, body: $body)
  }
`);
