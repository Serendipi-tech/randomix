import { builder, prisma } from '../../builder';
import { RolesEnum, StatusPaymentEnum } from '../../enum';

interface AdminUserRowShape {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  deletedAt: Date | null;
  createdAt: Date;
}

interface AdminUserPaymentShape {
  id: string;
  amount: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  createdAt: Date;
}

interface AdminUserDetailShape extends AdminUserRowShape {
  avatarUrl: string | null;
  membershipPlan: string;
  listsCount: number;
  groupsCount: number;
  friendsCount: number;
  payments: AdminUserPaymentShape[];
}

export const AdminUserRowRef = builder.objectRef<AdminUserRowShape>('AdminUserRow');
AdminUserRowRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    username: t.exposeString('username'),
    email: t.exposeString('email'),
    role: t.field({ type: RolesEnum, resolve: (u) => u.role }),
    deletedAt: t.field({ type: 'DateTime', nullable: true, resolve: (u) => u.deletedAt }),
    createdAt: t.field({ type: 'DateTime', resolve: (u) => u.createdAt }),
  }),
});

interface AdminUsersPayloadShape {
  users: AdminUserRowShape[];
  nextCursor: string | null;
}

export const AdminUsersPayloadRef = builder.objectRef<AdminUsersPayloadShape>('AdminUsersPayload');
AdminUsersPayloadRef.implement({
  fields: (t) => ({
    users: t.field({ type: [AdminUserRowRef], resolve: (p) => p.users }),
    nextCursor: t.exposeString('nextCursor', { nullable: true }),
  }),
});

const AdminUserPaymentRef = builder.objectRef<AdminUserPaymentShape>('AdminUserPayment');
AdminUserPaymentRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    amount: t.exposeFloat('amount'),
    status: t.field({ type: StatusPaymentEnum, resolve: (p) => p.status }),
    createdAt: t.field({ type: 'DateTime', resolve: (p) => p.createdAt }),
  }),
});

export const AdminUserDetailRef = builder.objectRef<AdminUserDetailShape>('AdminUserDetail');
AdminUserDetailRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    username: t.exposeString('username'),
    email: t.exposeString('email'),
    avatarUrl: t.exposeString('avatarUrl', { nullable: true }),
    role: t.field({ type: RolesEnum, resolve: (u) => u.role }),
    deletedAt: t.field({ type: 'DateTime', nullable: true, resolve: (u) => u.deletedAt }),
    createdAt: t.field({ type: 'DateTime', resolve: (u) => u.createdAt }),
    membershipPlan: t.exposeString('membershipPlan'),
    listsCount: t.exposeInt('listsCount'),
    groupsCount: t.exposeInt('groupsCount'),
    friendsCount: t.exposeInt('friendsCount'),
    payments: t.field({ type: [AdminUserPaymentRef], resolve: (u) => u.payments }),
  }),
});

// Riusata da query adminUser e mutation adminSetUserSuspended per non duplicare l'assemblaggio delle stats
export async function getAdminUserDetail(userId: string): Promise<AdminUserDetailShape | null> {
  const [user, activeSubscription, listsCount, groupsCount, friendsCount, payments] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
      orderBy: { startDate: 'desc' },
      select: { membership: { select: { plan: true } } },
    }),
    prisma.list.count({ where: { userId } }),
    prisma.group_User.count({ where: { userId } }),
    prisma.friendship.count({
      where: { status: 'ACCEPTED', OR: [{ senderId: userId }, { receiverId: userId }] },
    }),
    prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, amount: true, status: true, createdAt: true },
    }),
  ]);

  if (!user) return null;

  return {
    ...user,
    membershipPlan: activeSubscription?.membership.plan ?? 'FREE',
    listsCount,
    groupsCount,
    friendsCount,
    payments,
  };
}
