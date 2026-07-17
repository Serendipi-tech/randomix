import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const CREATE_TAG: DocumentNode = parse(`
  mutation CreateTag($name: String!, $color: String!) {
    createTag(name: $name, color: $color) {
      id
      name
      color
      isSystem
    }
  }
`);

export const DELETE_TAG: DocumentNode = parse(`
  mutation DeleteTag($id: ID!) {
    deleteTag(id: $id)
  }
`);
