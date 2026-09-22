import { builder } from '../../builder';

interface UserGrowthPointShape {
  date: Date;
  totalUsers: number;
}

interface MembershipPlanCountShape {
  plan: string;
  count: number;
}

interface AdminDashboardStatsShape {
  totalUsers: number;
  usersGrowth: UserGrowthPointShape[];
  usersByMembershipPlan: MembershipPlanCountShape[];
  avgListsPerUser: number;
  avgGroupsPerUser: number;
  avgUsersPerGroup: number;
}

export const UserGrowthPointRef = builder.objectRef<UserGrowthPointShape>('UserGrowthPoint');
UserGrowthPointRef.implement({
  fields: (t) => ({
    date: t.field({ type: 'DateTime', resolve: (p) => p.date }),
    totalUsers: t.exposeInt('totalUsers'),
  }),
});

export const MembershipPlanCountRef = builder.objectRef<MembershipPlanCountShape>('MembershipPlanCount');
MembershipPlanCountRef.implement({
  fields: (t) => ({
    plan: t.exposeString('plan'),
    count: t.exposeInt('count'),
  }),
});

export const AdminDashboardStatsRef = builder.objectRef<AdminDashboardStatsShape>('AdminDashboardStats');
AdminDashboardStatsRef.implement({
  fields: (t) => ({
    totalUsers: t.exposeInt('totalUsers'),
    usersGrowth: t.field({ type: [UserGrowthPointRef], resolve: (s) => s.usersGrowth }),
    usersByMembershipPlan: t.field({ type: [MembershipPlanCountRef], resolve: (s) => s.usersByMembershipPlan }),
    avgListsPerUser: t.exposeFloat('avgListsPerUser'),
    avgGroupsPerUser: t.exposeFloat('avgGroupsPerUser'),
    avgUsersPerGroup: t.exposeFloat('avgUsersPerGroup'),
  }),
});
