'use client';

import { useMutation, useQuery } from '@apollo/client';
import { AdminUserMutations, AdminUserQueries, UserMutations } from '@randomix/graphql-schema';

const { ADMIN_USER } = AdminUserQueries;
const { ADMIN_SET_USER_SUSPENDED } = AdminUserMutations;
const { REQUEST_PASSWORD_RESET } = UserMutations;

export interface AdminUserDetail {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  role: 'ADMIN' | 'USER';
  deletedAt: string | null;
  createdAt: string;
  membershipPlan: string;
  listsCount: number;
  groupsCount: number;
  friendsCount: number;
}

interface AdminUserQueryResult {
  adminUser: AdminUserDetail | null;
}

export function useAdminUserDetail(userId: string | null) {
  const { data, loading, error, refetch } = useQuery<AdminUserQueryResult>(ADMIN_USER, {
    variables: { id: userId },
    skip: !userId,
    fetchPolicy: 'network-only',
  });

  const [setSuspended, { loading: suspending }] = useMutation(ADMIN_SET_USER_SUSPENDED);
  const [requestReset, { loading: sendingReset, called: resetSent }] = useMutation(REQUEST_PASSWORD_RESET);

  const toggleSuspended = async (suspended: boolean) => {
    if (!userId) return;
    await setSuspended({ variables: { userId, suspended } });
    await refetch();
  };

  const sendPasswordReset = async () => {
    if (!data?.adminUser) return;
    await requestReset({ variables: { email: data.adminUser.email } });
  };

  return {
    user: data?.adminUser ?? null,
    loading,
    error,
    toggleSuspended,
    suspending,
    sendPasswordReset,
    sendingReset,
    resetSent,
  };
}
