'use client';

import { useQuery } from '@apollo/client';
import { AdminMembershipQueries } from '@randomix/graphql-schema';
import type { MembershipPlan, BillingOption, SupportPriority } from './membershipLabels';

const { ADMIN_MEMBERSHIPS } = AdminMembershipQueries;

export interface Membership {
  id: string;
  plan: MembershipPlan;
  description: string | null;
  price: number;
  currency: string;
  billing: BillingOption;
  maxLists: number | null;
  maxItemsPerList: number | null;
  hideItemsEnabled: boolean | null;
  imageUploadEnabled: boolean | null;
  maxGroupsCreatable: number | null;
  maxGroupsJoinable: number | null;
  showAds: boolean | null;
  supportPriority: SupportPriority | null;
  activeSubscriptionsCount: number;
}

interface AdminMembershipsQueryResult {
  adminMemberships: Membership[];
}

export function useMemberships() {
  const { data, loading, error, refetch } = useQuery<AdminMembershipsQueryResult>(ADMIN_MEMBERSHIPS, {
    fetchPolicy: 'cache-and-network',
  });

  return { memberships: data?.adminMemberships ?? [], loading, error, refetch };
}
