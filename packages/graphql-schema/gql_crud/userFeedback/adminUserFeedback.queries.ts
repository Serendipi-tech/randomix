import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const USER_FEEDBACKS: DocumentNode = parse(`
  query UserFeedbacks {
    userFeedbacks {
      id
      type
      title
      text
      page
      isImportant
      status
      seen
      adminNote
      senderUsername
      createdAt
    }
  }
`);
