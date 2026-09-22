import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const ADMIN_CREATE_MEMBERSHIP: DocumentNode = parse(`
  mutation AdminCreateMembership($input: MembershipInput!) {
    adminCreateMembership(input: $input) {
      id
      plan
      description
      price
      currency
      billing
      maxLists
      maxItemsPerList
      activeSubscriptionsCount
    }
  }
`);

export const ADMIN_UPDATE_MEMBERSHIP: DocumentNode = parse(`
  mutation AdminUpdateMembership($id: ID!, $input: MembershipInput!) {
    adminUpdateMembership(id: $id, input: $input) {
      id
      plan
      description
      price
      currency
      billing
      maxLists
      maxItemsPerList
      activeSubscriptionsCount
    }
  }
`);

export const ADMIN_DELETE_MEMBERSHIP: DocumentNode = parse(`
  mutation AdminDeleteMembership($id: ID!) {
    adminDeleteMembership(id: $id)
  }
`);
