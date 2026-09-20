import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const MY_FEEDBACKS: DocumentNode = parse(`
  query MyFeedbacks {
    myFeedbacks {
      id
      type
      title
      text
      page
      isImportant
      status
      createdAt
    }
  }
`);
