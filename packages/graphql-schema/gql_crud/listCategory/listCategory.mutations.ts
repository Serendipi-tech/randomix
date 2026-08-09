import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const ADMIN_CREATE_LIST_CATEGORY: DocumentNode = parse(`
  mutation AdminCreateListCategory($input: ListCategoryInput!) {
    adminCreateListCategory(input: $input) {
      id
      name
      description
      icon
      includedCategories
      listsCount
      groupListsCount
    }
  }
`);

export const ADMIN_UPDATE_LIST_CATEGORY: DocumentNode = parse(`
  mutation AdminUpdateListCategory($id: ID!, $input: ListCategoryInput!) {
    adminUpdateListCategory(id: $id, input: $input) {
      id
      name
      description
      icon
      includedCategories
      listsCount
      groupListsCount
    }
  }
`);

export const ADMIN_DELETE_LIST_CATEGORY: DocumentNode = parse(`
  mutation AdminDeleteListCategory($id: ID!) {
    adminDeleteListCategory(id: $id)
  }
`);
