import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const UPDATE_FEEDBACK_STATUS: DocumentNode = parse(`
  mutation UpdateFeedbackStatus($id: ID!, $status: FEEDBACK_STATUS!) {
    updateFeedbackStatus(id: $id, status: $status)
  }
`);

export const UPDATE_FEEDBACK_SEEN: DocumentNode = parse(`
  mutation UpdateFeedbackSeen($id: ID!, $seen: Boolean!) {
    updateFeedbackSeen(id: $id, seen: $seen)
  }
`);

export const UPDATE_FEEDBACK_IMPORTANT: DocumentNode = parse(`
  mutation UpdateFeedbackImportant($id: ID!, $isImportant: Boolean!) {
    updateFeedbackImportant(id: $id, isImportant: $isImportant)
  }
`);

export const UPDATE_FEEDBACK_NOTE: DocumentNode = parse(`
  mutation UpdateFeedbackNote($id: ID!, $adminNote: String) {
    updateFeedbackNote(id: $id, adminNote: $adminNote)
  }
`);
