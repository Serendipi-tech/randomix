import { builder } from '../../builder';
import { FeedbackStatusEnum, FeedbackTypeEnum } from '../../enum';

// Proiezione "sicura" per l'utente proprietario: adminNote/seen/userId non esistono in questo tipo,
// non solo omessi in query — garanzia strutturale (vedi docs/features/user_feedback/API_CONTRACT.md).
export const MyFeedbackRef = builder.prismaObject('UserFeedback', {
  name: 'MyFeedback',
  fields: (t) => ({
    id: t.exposeID('id'),
    type: t.field({
      type: FeedbackTypeEnum,
      resolve: (fb) => fb.type as 'BUG' | 'SUGGESTION' | 'COMMENT',
    }),
    title: t.exposeString('title', { nullable: true }),
    text: t.exposeString('text'),
    page: t.exposeString('page'),
    isImportant: t.exposeBoolean('isImportant'),
    // REJECTED non va mai mostrato all'utente come tale: collassato in DONE qui, non lasciato al client.
    status: t.field({
      type: FeedbackStatusEnum,
      resolve: (fb) => (fb.status === 'REJECTED' ? 'DONE' : (fb.status as 'SENT' | 'PROGRESS' | 'DONE')),
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
  }),
});

// --- Vista admin ---
// objectRef su forma piatta (come AdminReport/AdminUser), non un secondo prismaObject sullo stesso
// model: qui il dataset è sempre intero (nessuna query di dettaglio separata, vedi API_CONTRACT.md),
// quindi la stessa riga serve sia per la lista che per il pannello di dettaglio.

interface AdminFeedbackShape {
  id: string;
  type: 'BUG' | 'SUGGESTION' | 'COMMENT';
  title: string | null;
  text: string;
  page: string;
  isImportant: boolean;
  status: 'SENT' | 'PROGRESS' | 'DONE' | 'REJECTED';
  seen: boolean;
  adminNote: string | null;
  senderUsername: string | null; // null se l'autore è stato eliminato (onDelete: SetNull)
  createdAt: Date;
}

export const AdminFeedbackRef = builder.objectRef<AdminFeedbackShape>('AdminFeedback');
AdminFeedbackRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    type: t.field({ type: FeedbackTypeEnum, resolve: (fb) => fb.type }),
    title: t.exposeString('title', { nullable: true }),
    text: t.exposeString('text'),
    page: t.exposeString('page'),
    isImportant: t.exposeBoolean('isImportant'),
    status: t.field({ type: FeedbackStatusEnum, resolve: (fb) => fb.status }),
    seen: t.exposeBoolean('seen'),
    adminNote: t.exposeString('adminNote', { nullable: true }),
    senderUsername: t.exposeString('senderUsername', { nullable: true }),
    createdAt: t.field({ type: 'DateTime', resolve: (fb) => fb.createdAt }),
  }),
});

type FeedbackWithSender = {
  id: string;
  type: string;
  title: string | null;
  text: string;
  page: string;
  isImportant: boolean;
  status: string;
  seen: boolean;
  adminNote: string | null;
  createdAt: Date;
  user: { username: string } | null;
};

// Riusata da query e mutation admin per non duplicare l'assemblaggio della riga.
export function toAdminFeedback(fb: FeedbackWithSender): AdminFeedbackShape {
  return {
    id: fb.id,
    type: fb.type as AdminFeedbackShape['type'],
    title: fb.title,
    text: fb.text,
    page: fb.page,
    isImportant: fb.isImportant,
    status: fb.status as AdminFeedbackShape['status'],
    seen: fb.seen,
    adminNote: fb.adminNote,
    senderUsername: fb.user?.username ?? null,
    createdAt: fb.createdAt,
  };
}
