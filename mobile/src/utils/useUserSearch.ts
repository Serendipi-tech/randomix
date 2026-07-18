import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { FriendshipMutations, FriendshipQueries } from '@randomix/graphql-schema';
import type { Friend } from '@/utils/useFriends';

const { SEARCH_USERS } = FriendshipQueries;
const { SEND_FRIEND_REQUEST } = FriendshipMutations;

const SEARCH_MIN_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 400;

export type FriendRelation = 'NONE' | 'FRIEND' | 'REQUEST_SENT' | 'REQUEST_RECEIVED';

export interface UserSearchResult {
  user: Friend;
  relation: FriendRelation;
}

interface SearchUsersQuery {
  searchUsers: UserSearchResult[];
}

export function useUserSearch() {
  const [query, setQuery] = useState('');
  const [runSearch, { data, loading, error }] = useLazyQuery<SearchUsersQuery>(SEARCH_USERS, {
    fetchPolicy: 'network-only',
  });
  const [sendMutation, { loading: sending }] = useMutation(SEND_FRIEND_REQUEST, {
    // aggiorna la relation mostrata nei risultati correnti
    refetchQueries: ['SearchUsers'],
  });

  const trimmed = query.trim();
  const active = trimmed.length >= SEARCH_MIN_LENGTH;

  // debounce: la ricerca parte solo quando l'utente smette di digitare
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => {
      runSearch({ variables: { query: trimmed } });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [trimmed, active, runSearch]);

  const sendRequest = (userId: string) => sendMutation({ variables: { userId } });

  return {
    query,
    setQuery,
    results: active ? (data?.searchUsers ?? []) : [],
    searching: active && loading,
    active,
    error: error ?? null,
    sendRequest,
    sending,
  };
}
