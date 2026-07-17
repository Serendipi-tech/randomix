import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const ADD_ITEM_TO_LIST: DocumentNode = parse(`
  mutation AddItemToList($input: AddItemToListInput!) {
    addItemToList(input: $input) {
      id
      userItem {
        id
        description
        note
        status
        item {
          id
          name
          category
        }
      }
    }
  }
`);

export const UPDATE_USER_ITEM: DocumentNode = parse(`
  mutation UpdateUserItem($id: ID!, $input: UpdateUserItemInput!) {
    updateUserItem(id: $id, input: $input) {
      id
      description
      note
      status
      isHidden
    }
  }
`);

export const REMOVE_ITEM_FROM_LIST: DocumentNode = parse(`
  mutation RemoveItemFromList($id: ID!) {
    removeItemFromList(id: $id)
  }
`);
