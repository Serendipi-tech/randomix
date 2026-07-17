import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const CREATE_LIST: DocumentNode = parse(`
  mutation CreateList($input: CreateListInput!) {
    createList(input: $input) {
      id
      name
      icon
      color
      description
      isHidden
      updatedAt
    }
  }
`);

export const UPDATE_LIST: DocumentNode = parse(`
  mutation UpdateList($id: ID!, $input: UpdateListInput!) {
    updateList(id: $id, input: $input) {
      id
      name
      icon
      color
      description
      isHidden
      updatedAt
    }
  }
`);

export const DELETE_LIST: DocumentNode = parse(`
  mutation DeleteList($id: ID!) {
    deleteList(id: $id)
  }
`);
