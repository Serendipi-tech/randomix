import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const ADMIN_CREATE_CATEGORY: DocumentNode = parse(`
  mutation AdminCreateCategory($input: CategoryInput!) {
    adminCreateCategory(input: $input) {
      id
      name
      icon
    }
  }
`);

export const ADMIN_UPDATE_CATEGORY: DocumentNode = parse(`
  mutation AdminUpdateCategory($id: ID!, $input: CategoryInput!) {
    adminUpdateCategory(id: $id, input: $input) {
      id
      name
      icon
    }
  }
`);

export const ADMIN_DELETE_CATEGORY: DocumentNode = parse(`
  mutation AdminDeleteCategory($id: ID!) {
    adminDeleteCategory(id: $id)
  }
`);
