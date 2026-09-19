import { useState } from 'react';

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

interface CreateFeedbackInput {
  type: FeedbackType;
  title: string;
  text: string;
}

// Dati finti a scopo di scaffolding UI: nessun backend esiste ancora per questa feature.
const INITIAL_ITEMS: FeedbackItem[] = [
  {
    id: 'seed-1',
    type: 'BUG',
    title: 'Randomizer freezes',
    text: 'If I regenerate quickly several times in a row, sometimes the result stays empty.',
    status: 'PROGRESS',
    dateLabel: '2 days ago',
  },
  {
    id: 'seed-2',
    type: 'SUGGESTION',
    title: 'Sort lists by color',
    text: 'It would be nice to sort lists by color too, not just by date.',
    status: 'DONE',
    dateLabel: '1 week ago',
  },
  {
    id: 'seed-3',
    type: 'COMMENT',
    title: null,
    text: 'Really nice app, congrats on the design!',
    status: 'SENT',
    dateLabel: 'Today',
  },
];

/** Stato mock del feedback personale: nessuna persistenza reale, solo scaffolding UI
 *  finché il backend (createUserFeedback/myFeedbacks) non esiste. */
export function useFeedbackMock() {
  const [items, setItems] = useState<FeedbackItem[]>(INITIAL_ITEMS);

  const createFeedback = ({ type, title, text }: CreateFeedbackInput) => {
    const newItem: FeedbackItem = {
      id: `local-${Date.now()}`,
      type,
      title: title.trim().length > 0 ? title.trim() : null,
      text: text.trim(),
      status: 'SENT',
      dateLabel: 'Just now',
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const deleteFeedback = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const canDelete = (item: FeedbackItem) => item.status === 'SENT';

  return { items, createFeedback, deleteFeedback, canDelete };
}
