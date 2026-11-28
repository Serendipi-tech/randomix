import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { MembershipQueries } from '@randomix/graphql-schema';
import {
  formatEndDateLabel,
  formatLimitsSummary,
  formatPrice,
  planLabel,
  type MembershipData,
} from './membershipFormat';
import { useMyPlan } from './useMyPlan';

const { MEMBERSHIP_PLANS } = MembershipQueries;

export type { MembershipPlanId } from './membershipFormat';

interface MembershipPlansQuery {
  membershipPlans: MembershipData[];
}

export interface MembershipPlanCard {
  id: string;
  planLabel: string;
  priceLabel: string;
  limitsSummary: string;
  isCurrent: boolean;
  endDateLabel: string | null;
}

/** Catalogo dei piani per il confronto. Il piano in uso arriva da `useMyPlan` (query leggera già in
 *  cache dall'accesso): qui non si interroga di nuovo la subscription. */
export function useMembershipPlans() {
  const { t } = useTranslation('profile');
  const { currentPlan } = useMyPlan();

  const { data, loading, error } = useQuery<MembershipPlansQuery>(MEMBERSHIP_PLANS, {
    fetchPolicy: 'cache-and-network',
  });

  const plans: MembershipPlanCard[] = (data?.membershipPlans ?? []).map((membership) => ({
    id: membership.id,
    planLabel: planLabel(membership.plan, t),
    priceLabel: formatPrice(membership, t),
    limitsSummary: formatLimitsSummary(membership, t),
    isCurrent: membership.plan === currentPlan,
    endDateLabel: membership.endDate == null ? null : formatEndDateLabel(membership.endDate, t),
  }));

  return {
    plans,
    currentPlan,
    loading,
    error: error ?? null,
  };
}
