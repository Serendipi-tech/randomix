import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { MembershipQueries } from '@randomix/graphql-schema';

const { MEMBERSHIP_PLANS, MY_MEMBERSHIP } = MembershipQueries;

export type MembershipPlanId = 'FREE' | 'PREMIUM' | 'UNLIMITED' | 'FREE_TRIAL' | 'FULL_ACCESS';
type BillingOption = 'NEVER' | 'MONTHLY' | 'YEARLY';
type SupportPriority = 'LOW' | 'MEDIUM' | 'HIGH';

interface MembershipData {
  id: string;
  plan: MembershipPlanId;
  description: string | null;
  price: number;
  currency: string;
  billing: BillingOption;
  maxLists: number | null;
  maxItemsPerList: number | null;
  hideItemsEnabled: boolean | null;
  maxGroupsCreatable: number | null;
  maxGroupsJoinable: number | null;
  showAds: boolean | null;
  supportPriority: SupportPriority | null;
  endDate: string | null;
}

interface MembershipPlansQuery {
  membershipPlans: MembershipData[];
}

interface MyMembershipQuery {
  myMembership: MembershipData | null;
}

export interface MembershipPlanCard {
  id: string;
  planLabel: string;
  priceLabel: string;
  limitsSummary: string;
  isCurrent: boolean;
  endDateLabel: string | null;
}

export function useMembershipPlans() {
  const { t } = useTranslation('profile');

  const {
    data: plansData,
    loading: plansLoading,
    error: plansError,
  } = useQuery<MembershipPlansQuery>(MEMBERSHIP_PLANS, { fetchPolicy: 'cache-and-network' });

  const {
    data: myData,
    loading: myLoading,
    error: myError,
  } = useQuery<MyMembershipQuery>(MY_MEMBERSHIP, { fetchPolicy: 'cache-and-network' });

  // Nessuna subscription attiva = piano FREE implicito (stessa convenzione del pannello admin)
  const currentPlan: MembershipPlanId = myData?.myMembership?.plan ?? 'FREE';

  const plans: MembershipPlanCard[] = (plansData?.membershipPlans ?? []).map((membership) => ({
    id: membership.id,
    planLabel: t(`settings.payments.plans.planNames.${membership.plan}`),
    priceLabel: formatPrice(membership, t),
    limitsSummary: formatLimitsSummary(membership, t),
    isCurrent: membership.plan === currentPlan,
    endDateLabel: membership.endDate == null ? null : formatEndDateLabel(membership.endDate, t),
  }));

  return {
    plans,
    loading: plansLoading || myLoading,
    error: plansError ?? myError ?? null,
  };
}

function formatPrice(membership: MembershipData, t: (key: string) => string): string {
  if (membership.price === 0) {
    return t('settings.payments.plans.free');
  }
  const billingSuffix = t(`settings.payments.plans.billing.${membership.billing}`);
  return `${membership.price} ${membership.currency} ${billingSuffix}`;
}

function formatEndDateLabel(endDate: string, t: (key: string, opts?: Record<string, unknown>) => string): string {
  const date = new Date(endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  return t('settings.payments.plans.endDateLabel', { date });
}

function formatLimitsSummary(membership: MembershipData, t: (key: string, opts?: Record<string, unknown>) => string): string {
  const lists =
    membership.maxLists == null
      ? t('settings.payments.plans.limits.listsUnlimited')
      : t('settings.payments.plans.limits.lists', { count: membership.maxLists });
  const items =
    membership.maxItemsPerList == null
      ? t('settings.payments.plans.limits.itemsPerListUnlimited')
      : t('settings.payments.plans.limits.itemsPerList', { count: membership.maxItemsPerList });
  const groups =
    membership.maxGroupsCreatable == null
      ? t('settings.payments.plans.limits.groupsUnlimited')
      : t('settings.payments.plans.limits.groups', { count: membership.maxGroupsCreatable });

  return [lists, items, groups].join(' · ');
}
