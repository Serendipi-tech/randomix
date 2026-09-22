import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const CREATE_USER_FEEDBACK: DocumentNode = parse(`
  mutation CreateUserFeedback($type: FEEDBACK_TYPE!, $title: String, $text: String!, $page: String!) {
    createUserFeedback(type: $type, title: $title, text: $text, page: $page) {
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

export const DELETE_USER_FEEDBACK: DocumentNode = parse(`
  mutation DeleteUserFeedback($id: ID!) {
    deleteUserFeedback(id: $id)
  }
`);
