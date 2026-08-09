import { builder, prisma } from '../../builder';
import { MembershipPlanEnum, BillingEnum } from '../../enum';

interface MembershipLimitations {
  maxLists?: number | null;
  maxItemsPerList?: number | null;
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
    // { maxLists, maxItemsPerList }, null = illimitato.
    maxLists: t.int({
      nullable: true,
      resolve: (m) => (m.limitations as MembershipLimitations | null)?.maxLists ?? null,
    }),
    maxItemsPerList: t.int({
      nullable: true,
      resolve: (m) => (m.limitations as MembershipLimitations | null)?.maxItemsPerList ?? null,
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    activeSubscriptionsCount: t.int({
      resolve: (m) => prisma.subscription.count({ where: { membershipId: m.id, status: 'ACTIVE' } }),
    }),
  }),
});
