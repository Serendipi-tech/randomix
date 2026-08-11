export const REPORT_STATUSES = ['SENT', 'IN_PROGRESS', 'SOLVED', 'REJECTED'] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const STATUS_LABELS: Record<ReportStatus, string> = {
  SENT: 'Inviata',
  IN_PROGRESS: 'In lavorazione',
  SOLVED: 'Risolta',
  REJECTED: 'Rifiutata',
};

export const STATUS_COLORS: Record<ReportStatus, string> = {
  SENT: 'var(--info)',
  IN_PROGRESS: 'var(--warning)',
  SOLVED: 'var(--success)',
  REJECTED: 'var(--error)',
};

export const REPORT_TYPES = ['BUG', 'FEEDBACK', 'REPORT'] as const;
export type ReportType = (typeof REPORT_TYPES)[number];

export const TYPE_LABELS: Record<ReportType, string> = {
  BUG: 'Bug',
  FEEDBACK: 'Feedback',
  REPORT: 'Segnalazione',
};
