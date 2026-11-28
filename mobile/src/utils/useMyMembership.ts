import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { MembershipQueries } from '@randomix/graphql-schema';
import {
  formatDetailRows,
  formatEndDateLabel,
  formatPrice,
  planLabel,
  type MembershipData,
  type MembershipDetailRow,
  type MembershipPlanId,
} from './membershipFormat';

const { MEMBERSHIP_PLANS, MY_MEMBERSHIP } = MembershipQueries;

interface MyMembershipQuery {
  myMembership: MembershipData | null;
}

interface MembershipPlansQuery {
  membershipPlans: MembershipData[];
}

export interface MyPlanView {
  plan: MembershipPlanId;
  planLabel: string;
  /** Riga di presentazione del piano, scritta a gestionale: può mancare. */
  description: string | null;
  priceLabel: string;
  endDateLabel: string | null;
  detailRows: MembershipDetailRow[];
}

/** Dati del piano in uso, per la pagina del piano personale. Senza subscription attiva ricade sulla
 *  voce FREE del catalogo: i limiti del gratuito stanno lì, non su `myMembership` che è nullo. */
export function useMyMembership() {
  const { t } = useTranslation('profile');

  const { data, loading, error } = useQuery<MyMembershipQuery>(MY_MEMBERSHIP, {
    fetchPolicy: 'cache-and-network',
  });

  const mine = data?.myMembership ?? null;

  // Il catalogo serve solo per i limiti del piano gratuito: con una subscription attiva non parte
  const {
    data: plansData,
    loading: plansLoading,
    error: plansError,
  } = useQuery<MembershipPlansQuery>(MEMBERSHIP_PLANS, {
    fetchPolicy: 'cache-first',
    skip: data === undefined || mine !== null,
  });

  const membership = mine ?? plansData?.membershipPlans.find((plan) => plan.plan === 'FREE') ?? null;

  const view: MyPlanView | null = membership && {
    plan: membership.plan,
    planLabel: planLabel(membership.plan, t),
    description: membership.description,
    priceLabel: formatPrice(membership, t),
    endDateLabel: mine?.endDate ? formatEndDateLabel(mine.endDate, t) : null,
    detailRows: formatDetailRows(membership, t),
  };

  return {
    myPlan: view,
    loading: loading || plansLoading,
    error: error ?? plansError ?? null,
  };
}
