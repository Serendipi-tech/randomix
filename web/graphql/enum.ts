import { builder } from './builder';

export const RolesEnum = builder.enumType('ROLES', {
  values: ['ADMIN', 'USER'] as const,
});

export const RolesGroupEnum = builder.enumType('ROLES_GROUP', {
  values: ['OWNER', 'ADMIN', 'AUTO_CONTRIBUTOR', 'CONTRIBUTOR', 'MEMBER'] as const,
});

export const BillingEnum = builder.enumType('BILLING', {
  values: ['NEVER', 'MONTHLY', 'YEARLY'] as const,
});

// CategoryEnum rimosso: le categorie sono ora il model Category (web/graphql/models/category).

export const MembershipPlanEnum = builder.enumType('MEMBERSHIP_PLAN', {
  values: ['FREE', 'PREMIUM', 'UNLIMITED', 'FREE_TRIAL', 'FULL_ACCESS'] as const,
});

builder.enumType('NOTIFICATION_TYPE', {
  values: [
    'CHALLENGE_NEW', 'CHALLENGE_COMPLETED', 'CHALLENGE_FAILED',
    'FRIENDSHIP', 'GROUP_INVITE', 'GROUP_AUTOCONTRIBUTOR', 'SYSTEM',
  ] as const,
});

export const ReportTypeEnum = builder.enumType('REPORT_TYPE', {
  values: ['BUG', 'FEEDBACK', 'REPORT'] as const,
});

export const StatusCompletionEnum = builder.enumType('STATUS_COMPLETION', {
  values: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] as const,
});

builder.enumType('STATUS_FRIENDSHIP', {
  values: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELED'] as const,
});

export const StatusPaymentEnum = builder.enumType('STATUS_PAYMENT', {
  values: ['SUCCESS', 'PENDING', 'FAILED'] as const,
});

export const StatusReportEnum = builder.enumType('STATUS_REPORT', {
  values: ['SENT', 'IN_PROGRESS', 'SOLVED', 'REJECTED'] as const,
});

builder.enumType('STATUS_SUBSCRIPTION', {
  values: ['ACTIVE', 'PAST_DUE', 'CANCELED', 'UNPAID'] as const,
});

builder.enumType('STATUS_CHALLENGE', {
  values: ['DRAFT', 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED'] as const,
});

builder.enumType('CHALLENGE_TIMEFRAME', {
  values: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const,
});

export const FeedbackTypeEnum = builder.enumType('FEEDBACK_TYPE', {
  values: ['BUG', 'SUGGESTION', 'COMMENT'] as const,
});

export const FeedbackStatusEnum = builder.enumType('FEEDBACK_STATUS', {
  values: ['SENT', 'PROGRESS', 'DONE', 'REJECTED'] as const,
});
