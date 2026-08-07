'use client';

import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { AdminUserQueries } from '@randomix/graphql-schema';

const { ADMIN_USERS } = AdminUserQueries;

const SEARCH_DEBOUNCE_MS = 400;
const PAGE_SIZE = 20;

export interface AdminUserRow {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  deletedAt: string | null;
  createdAt: string;
}

interface AdminUsersQueryResult {
  adminUsers: { users: AdminUserRow[]; nextCursor: string | null };
}

// Ricerca con debounce (stesso pattern di useUserSearch su mobile) + paginazione cursor "carica altri".
export function useAdminUsers() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [runQuery, { loading, error }] = useLazyQuery<AdminUsersQueryResult>(ADMIN_USERS, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      runQuery({ variables: { search: search.trim() || undefined, limit: PAGE_SIZE } }).then((res) => {
        setUsers(res.data?.adminUsers.users ?? []);
        setNextCursor(res.data?.adminUsers.nextCursor ?? null);
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search, runQuery]);

  const loadMore = async () => {
    if (!nextCursor) return;
    const res = await runQuery({
      variables: { search: search.trim() || undefined, limit: PAGE_SIZE, cursor: nextCursor },
    });
    setUsers((prev) => [...prev, ...(res.data?.adminUsers.users ?? [])]);
    setNextCursor(res.data?.adminUsers.nextCursor ?? null);
  };

  return { search, setSearch, users, nextCursor, loadMore, loading, error };
}
