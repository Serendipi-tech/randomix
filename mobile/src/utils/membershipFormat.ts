export type MembershipPlanId = 'FREE' | 'PREMIUM' | 'UNLIMITED' | 'FREE_TRIAL' | 'FULL_ACCESS';
export type BillingOption = 'NEVER' | 'MONTHLY' | 'YEARLY';
export type SupportPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface MembershipData {
  id: string;
  plan: MembershipPlanId;
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
  endDate: string | null;
}

/** `t` di react-i18next ridotto a ciò che serve qui: queste funzioni sono pure, la traduzione
 *  arriva da fuori. */
type Translate = (key: string, options?: Record<string, unknown>) => string;

const PLANS_NS = 'settings.payments.plans';

export function planLabel(plan: MembershipPlanId, t: Translate): string {
  return t(`${PLANS_NS}.planNames.${plan}`);
}

export function formatPrice(membership: MembershipData, t: Translate): string {
  if (membership.price === 0) return t(`${PLANS_NS}.free`);
  return `${membership.price} ${membership.currency} ${t(`${PLANS_NS}.billing.${membership.billing}`)}`;
}

export function formatEndDateLabel(endDate: string, t: Translate): string {
  const date = new Date(endDate).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return t(`${PLANS_NS}.endDateLabel`, { date });
}

export function formatLimitsSummary(membership: MembershipData, t: Translate): string {
  const lists =
    membership.maxLists == null
      ? t(`${PLANS_NS}.limits.listsUnlimited`)
      : t(`${PLANS_NS}.limits.lists`, { count: membership.maxLists });
  const items =
    membership.maxItemsPerList == null
      ? t(`${PLANS_NS}.limits.itemsPerListUnlimited`)
      : t(`${PLANS_NS}.limits.itemsPerList`, { count: membership.maxItemsPerList });
  const groups =
    membership.maxGroupsCreatable == null
      ? t(`${PLANS_NS}.limits.groupsUnlimited`)
      : t(`${PLANS_NS}.limits.groups`, { count: membership.maxGroupsCreatable });

  return [lists, items, groups].join(' · ');
}

export interface MembershipDetailRow {
  key: string;
  label: string;
  /** Valore testuale a destra (conteggi, livelli). Assente quando la voce è un sì/no. */
  value?: string;
  /** Voce sì/no: a destra va una spunta o una croce invece del testo. */
  available?: boolean;
}

/** Righe del piano personale: una per caratteristica, con un conteggio oppure un sì/no. */
export function formatDetailRows(membership: MembershipData, t: Translate): MembershipDetailRow[] {
  const upTo = (value: number | null) =>
    value == null ? t(`${PLANS_NS}.myPlan.unlimited`) : t(`${PLANS_NS}.myPlan.upTo`, { count: value });

  return [
    { key: 'lists', label: t(`${PLANS_NS}.myPlan.rows.lists`), value: upTo(membership.maxLists) },
    {
      key: 'itemsPerList',
      label: t(`${PLANS_NS}.myPlan.rows.itemsPerList`),
      value: upTo(membership.maxItemsPerList),
    },
    {
      key: 'groupsCreatable',
      label: t(`${PLANS_NS}.myPlan.rows.groupsCreatable`),
      value: upTo(membership.maxGroupsCreatable),
    },
    {
      key: 'groupsJoinable',
      label: t(`${PLANS_NS}.myPlan.rows.groupsJoinable`),
      value: upTo(membership.maxGroupsJoinable),
    },
    {
      key: 'hideItems',
      label: t(`${PLANS_NS}.myPlan.rows.hideItems`),
      available: membership.hideItemsEnabled === true,
    },
    {
      key: 'imageUpload',
      label: t(`${PLANS_NS}.myPlan.rows.imageUpload`),
      available: membership.imageUploadEnabled === true,
    },
    // Voce girata al positivo: la riga dice "senza pubblicità", quindi la spunta è l'assenza di ads
    { key: 'noAds', label: t(`${PLANS_NS}.myPlan.rows.noAds`), available: membership.showAds !== true },
    {
      key: 'support',
      label: t(`${PLANS_NS}.myPlan.rows.support`),
      value: t(`${PLANS_NS}.myPlan.support.${membership.supportPriority ?? 'LOW'}`),
    },
  ];
}
