import { useMutation, useQuery } from '@apollo/client';
import { UserFeedbackMutations, UserFeedbackQueries } from '@randomix/graphql-schema';

const { MY_FEEDBACKS } = UserFeedbackQueries;
const { CREATE_USER_FEEDBACK, DELETE_USER_FEEDBACK } = UserFeedbackMutations;

// Unico entry point attuale del feedback (icona nel Profilo): niente rilevamento sezione
// automatico finché non ne esistono altri — vedi docs/features/user_feedback/README.md §5.
const FEEDBACK_PAGE = 'profile';

export type FeedbackType = 'BUG' | 'SUGGESTION' | 'COMMENT';
export type FeedbackStatus = 'SENT' | 'PROGRESS' | 'DONE';

export interface FeedbackItem {
  id: string;
  type: FeedbackType;
  title: string | null;
  text: string;
  status: FeedbackStatus;
  dateLabel: string;
}

interface RawFeedback {
  id: string;
  type: FeedbackType;
  title: string | null;
  text: string;
  status: FeedbackStatus;
  createdAt: string;
}

interface MyFeedbacksQuery {
  myFeedbacks: RawFeedback[];
}

interface CreateFeedbackInput {
  type: FeedbackType;
  title: string;
  text: string;
}

function formatDateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

/** Cronologia feedback personale: query + invio + eliminazione, contro il backend reale
 *  (createUserFeedback/myFeedbacks/deleteUserFeedback). */
export function useFeedbacks() {
  const { data, loading, error } = useQuery<MyFeedbacksQuery>(MY_FEEDBACKS, {
    fetchPolicy: 'cache-and-network',
  });

  const [createMutate, { loading: creating }] = useMutation(CREATE_USER_FEEDBACK, {
    refetchQueries: [{ query: MY_FEEDBACKS }],
  });
  const [deleteMutate, { loading: deleting }] = useMutation(DELETE_USER_FEEDBACK, {
    refetchQueries: [{ query: MY_FEEDBACKS }],
  });

  const items: FeedbackItem[] = (data?.myFeedbacks ?? []).map((fb) => ({
    id: fb.id,
    type: fb.type,
    title: fb.title,
    text: fb.text,
    status: fb.status,
    dateLabel: formatDateLabel(fb.createdAt),
  }));

  const createFeedback = async ({ type, title, text }: CreateFeedbackInput) => {
    await createMutate({
      variables: { type, title: title.trim() || null, text: text.trim(), page: FEEDBACK_PAGE },
    });
  };

  const deleteFeedback = async (id: string) => {
    await deleteMutate({ variables: { id } });
  };

  const canDelete = (item: FeedbackItem) => item.status === 'SENT';

  return { items, loading, error: error ?? null, creating, deleting, createFeedback, deleteFeedback, canDelete };
}
