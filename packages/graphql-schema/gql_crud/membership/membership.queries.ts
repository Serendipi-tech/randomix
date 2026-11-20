import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

const MEMBERSHIP_FIELDS = `
  id
  plan
  description
  price
  currency
  billing
  maxLists
  maxItemsPerList
  hideItemsEnabled
  maxGroupsCreatable
  maxGroupsJoinable
  showAds
  supportPriority
`;

export const MEMBERSHIP_PLANS: DocumentNode = parse(`
  query MembershipPlans {
    membershipPlans {
      ${MEMBERSHIP_FIELDS}
    }
  }
`);

export const MY_MEMBERSHIP: DocumentNode = parse(`
  query MyMembership {
    myMembership {
      ${MEMBERSHIP_FIELDS}
    }
  }
`);
