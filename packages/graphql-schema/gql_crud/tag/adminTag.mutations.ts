import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const ADMIN_PROMOTE_TAG_TO_SYSTEM: DocumentNode = parse(`
  mutation AdminPromoteTagToSystem($name: String!) {
    adminPromoteTagToSystem(name: $name) {
      id
      name
      color
      isSystem
      itemsCount
    }
  }
`);

export const ADMIN_UPDATE_SYSTEM_TAG: DocumentNode = parse(`
  mutation AdminUpdateSystemTag($id: ID!, $name: String, $color: String) {
    adminUpdateSystemTag(id: $id, name: $name, color: $color) {
      id
      name
      color
      itemsCount
    }
  }
`);

export const ADMIN_DELETE_SYSTEM_TAG: DocumentNode = parse(`
  mutation AdminDeleteSystemTag($id: ID!) {
    adminDeleteSystemTag(id: $id)
  }
`);
