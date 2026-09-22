'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { AdminUserFeedbackMutations, AdminUserFeedbackQueries } from '@randomix/graphql-schema';
import { statusToTab, type FeedbackStatus, type FeedbackTab, type FeedbackType } from './feedbackLabels';

const { USER_FEEDBACKS } = AdminUserFeedbackQueries;
const { UPDATE_FEEDBACK_STATUS, UPDATE_FEEDBACK_SEEN, UPDATE_FEEDBACK_IMPORTANT, UPDATE_FEEDBACK_NOTE } =
  AdminUserFeedbackMutations;

export interface AdminFeedbackRow {
  id: string;
  type: FeedbackType;
  title: string | null;
  text: string;
  page: string;
  isImportant: boolean;
  status: FeedbackStatus;
  seen: boolean;
  adminNote: string | null;
  senderUsername: string | null;
  createdAt: string;
}

interface UserFeedbacksQueryResult {
  userFeedbacks: AdminFeedbackRow[];
}

// Dataset intero caricato una volta, tab/ricerca/importanti filtrano l'array in memoria —
// scelta della spec, non un'ottimizzazione mancata (vedi docs/features/user_feedback/README.md §6.1).
export function useAdminFeedbacks() {
  const { data, loading, error } = useQuery<UserFeedbacksQueryResult>(USER_FEEDBACKS, {
    fetchPolicy: 'network-only',
  });

  const [tab, setTab] = useState<FeedbackTab>('received');
  const [search, setSearch] = useState('');
  const [importantOnly, setImportantOnly] = useState(false);

  const [updateStatusMutate] = useMutation(UPDATE_FEEDBACK_STATUS, { refetchQueries: [{ query: USER_FEEDBACKS }] });
  const [updateSeenMutate] = useMutation(UPDATE_FEEDBACK_SEEN, { refetchQueries: [{ query: USER_FEEDBACKS }] });
  const [updateImportantMutate] = useMutation(UPDATE_FEEDBACK_IMPORTANT, {
    refetchQueries: [{ query: USER_FEEDBACKS }],
  });
  const [updateNoteMutate, { loading: savingNote }] = useMutation(UPDATE_FEEDBACK_NOTE, {
    refetchQueries: [{ query: USER_FEEDBACKS }],
  });

  const all = data?.userFeedbacks ?? [];

  const counts = useMemo(
    () => ({
      unread: all.filter((f) => !f.seen).length,
      progress: all.filter((f) => f.status === 'PROGRESS').length,
    }),
    [all],
  );

  const feedbacks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return all.filter((f) => {
      if (statusToTab(f.status) !== tab) return false;
      if (importantOnly && !f.isImportant) return false;
      if (!query) return true;
      return (
        (f.title?.toLowerCase().includes(query) ?? false) ||
        f.text.toLowerCase().includes(query) ||
        (f.senderUsername?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [all, tab, importantOnly, search]);

  return {
    feedbacks,
    counts,
    tab,
    setTab,
    search,
    setSearch,
    importantOnly,
    setImportantOnly,
    loading,
    error,
    updateStatus: (id: string, status: FeedbackStatus) => updateStatusMutate({ variables: { id, status } }),
    updateSeen: (id: string, seen: boolean) => updateSeenMutate({ variables: { id, seen } }),
    updateImportant: (id: string, isImportant: boolean) =>
      updateImportantMutate({ variables: { id, isImportant } }),
    updateNote: (id: string, adminNote: string) =>
      updateNoteMutate({ variables: { id, adminNote: adminNote.trim() || null } }),
    savingNote,
  };
}
