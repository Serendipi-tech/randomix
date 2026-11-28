import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { MembershipQueries } from '@randomix/graphql-schema';
import {
  formatHighlights,
  planLabel,
  type MembershipData,
  type MembershipHighlight,
} from './membershipFormat';

const { MEMBERSHIP_PLANS } = MembershipQueries;

interface MembershipPlansQuery {
  membershipPlans: MembershipData[];
}

export interface PremiumPlanView {
  id: string;
  planLabel: string;
  description: string | null;
  priceAmount: string;
  /** Periodicità già tradotta ("/month"): sta accanto al prezzo, con un peso diverso. */
  billingSuffix: string;
  highlights: MembershipHighlight[];
}

/** Piano a pagamento proposto nella pagina di upgrade: il più economico fra quelli non gratuiti,
 *  escluso l'annuale (l'offerta ha un solo taglio). */
export function usePremiumPlan() {
  const { t } = useTranslation('profile');

  const { data, loading, error } = useQuery<MembershipPlansQuery>(MEMBERSHIP_PLANS, {
    fetchPolicy: 'cache-and-network',
  });

  const candidates = (data?.membershipPlans ?? [])
    .filter((plan) => plan.plan !== 'FREE' && plan.plan !== 'FREE_TRIAL' && plan.billing !== 'YEARLY')
    .sort((a, b) => a.price - b.price);

  const membership = candidates[0] ?? null;

  const premiumPlan: PremiumPlanView | null = membership && {
    id: membership.id,
    planLabel: planLabel(membership.plan, t),
    description: membership.description,
    priceAmount: `${membership.currency === 'EUR' ? '€' : `${membership.currency} `}${membership.price.toFixed(2)}`,
    billingSuffix: t(`settings.payments.plans.billing.${membership.billing}`),
    highlights: formatHighlights(membership, t),
  };

  return { premiumPlan, loading, error: error ?? null };
}
