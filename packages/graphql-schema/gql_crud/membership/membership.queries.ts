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
  imageUploadEnabled
  maxGroupsCreatable
  maxGroupsJoinable
  showAds
  supportPriority
  endDate
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

/** Solo il tipo di piano, niente prezzi né limiti: viene caricata all'accesso perché i banner
 *  premium siano già decisi quando le pagine si disegnano. Deliberatamente separata da
 *  MY_MEMBERSHIP, che serve alla pagina del piano personale. */
export const MY_PLAN: DocumentNode = parse(`
  query MyPlan {
    myMembership {
      id
      plan
    }
  }
`);
