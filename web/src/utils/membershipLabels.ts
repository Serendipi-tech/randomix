export const MEMBERSHIP_PLANS = ['FREE', 'PREMIUM', 'UNLIMITED', 'FREE_TRIAL', 'FULL_ACCESS'] as const;
export type MembershipPlan = (typeof MEMBERSHIP_PLANS)[number];

export const PLAN_LABELS: Record<MembershipPlan, string> = {
  FREE: 'Free',
  PREMIUM: 'Premium',
  UNLIMITED: 'Unlimited',
  FREE_TRIAL: 'Prova gratuita',
  FULL_ACCESS: 'Accesso completo',
};

export const BILLING_OPTIONS = ['NEVER', 'MONTHLY', 'YEARLY'] as const;
export type BillingOption = (typeof BILLING_OPTIONS)[number];

export const BILLING_LABELS: Record<BillingOption, string> = {
  NEVER: 'Una tantum',
  MONTHLY: 'Mensile',
  YEARLY: 'Annuale',
};
