export const FEEDBACK_STATUSES = ['SENT', 'PROGRESS', 'DONE', 'REJECTED'] as const;
export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

export const STATUS_LABELS: Record<FeedbackStatus, string> = {
  SENT: 'Ricevuto',
  PROGRESS: 'In lavorazione',
  DONE: 'Risolto',
  REJECTED: 'Rifiutato',
};

export const STATUS_COLORS: Record<FeedbackStatus, string> = {
  SENT: 'var(--info)',
  PROGRESS: 'var(--warning)',
  DONE: 'var(--success)',
  REJECTED: 'var(--error)',
};

export const FEEDBACK_TYPES = ['BUG', 'SUGGESTION', 'COMMENT'] as const;
export type FeedbackType = (typeof FEEDBACK_TYPES)[number];

export const TYPE_LABELS: Record<FeedbackType, string> = {
  BUG: 'Bug',
  SUGGESTION: 'Suggerimento',
  COMMENT: 'Commento',
};

// Le 3 tab della vista admin: "Conclusi" raggruppa DONE e REJECTED nella stessa vista
// (si distinguono solo dal colore/etichetta del badge stato), non sono tab separate.
export type FeedbackTab = 'received' | 'progress' | 'concluded';

export const TAB_LABELS: Record<FeedbackTab, string> = {
  received: 'Ricevuti',
  progress: 'In lavorazione',
  concluded: 'Conclusi',
};

export function statusToTab(status: FeedbackStatus): FeedbackTab {
  if (status === 'SENT') return 'received';
  if (status === 'PROGRESS') return 'progress';
  return 'concluded';
}
