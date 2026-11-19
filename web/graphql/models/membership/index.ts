import { builder, prisma } from '../../builder';
import { MembershipPlanEnum, BillingEnum } from '../../enum';

export const SupportPriorityEnum = builder.enumType('SUPPORT_PRIORITY', {
  values: ['LOW', 'MEDIUM', 'HIGH'] as const,
});

interface MembershipLimitations {
  maxLists?: number | null;
  maxItemsPerList?: number | null;
  hideItemsEnabled?: boolean | null;
  maxGroupsCreatable?: number | null;
  maxGroupsJoinable?: number | null;
  showAds?: boolean | null;
  supportPriority?: 'LOW' | 'MEDIUM' | 'HIGH' | null;
}

export const MembershipRef = builder.prismaObject('Membership', {
  fields: (t) => ({
    id: t.exposeID('id'),
    plan: t.field({
      type: MembershipPlanEnum,
      resolve: (m) => m.plan as 'FREE' | 'PREMIUM' | 'UNLIMITED' | 'FREE_TRIAL' | 'FULL_ACCESS',
    }),
    description: t.exposeString('description', { nullable: true }),
    price: t.exposeFloat('price'),
    currency: t.exposeString('currency'),
    billing: t.field({
      type: BillingEnum,
      resolve: (m) => m.billing as 'NEVER' | 'MONTHLY' | 'YEARLY',
    }),
    // limitations è un JSON libero in schema; qui esposto con la forma fissata (STEP 7):
    // { maxLists, maxItemsPerList, hideItemsEnabled, maxGroupsCreatable, maxGroupsJoinable,
    //   showAds, supportPriority }, null = illimitato/non impostato.
    maxLists: t.int({
      nullable: true,
      resolve: (m) => (m.limitations as MembershipLimitations | null)?.maxLists ?? null,
    }),
    maxItemsPerList: t.int({
      nullable: true,
      resolve: (m) => (m.limitations as MembershipLimitations | null)?.maxItemsPerList ?? null,
    }),
    hideItemsEnabled: t.boolean({
      nullable: true,
      resolve: (m) => (m.limitations as MembershipLimitations | null)?.hideItemsEnabled ?? null,
    }),
    maxGroupsCreatable: t.int({
      nullable: true,
      resolve: (m) => (m.limitations as MembershipLimitations | null)?.maxGroupsCreatable ?? null,
    }),
    maxGroupsJoinable: t.int({
      nullable: true,
      resolve: (m) => (m.limitations as MembershipLimitations | null)?.maxGroupsJoinable ?? null,
    }),
    showAds: t.boolean({
      nullable: true,
      resolve: (m) => (m.limitations as MembershipLimitations | null)?.showAds ?? null,
    }),
    supportPriority: t.field({
      type: SupportPriorityEnum,
      nullable: true,
      resolve: (m) => (m.limitations as MembershipLimitations | null)?.supportPriority ?? null,
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    activeSubscriptionsCount: t.int({
      resolve: (m) => prisma.subscription.count({ where: { membershipId: m.id, status: 'ACTIVE' } }),
    }),
  }),
});
