import { builder } from '../../builder';
import { FeedbackStatusEnum, FeedbackTypeEnum } from '../../enum';

// Espone solo i campi "sicuri" per il proprietario: adminNote/seen/userId non compaiono qui,
// non solo omessi in query — garanzia strutturale (vedi docs/features/user_feedback/API_CONTRACT.md).
// Quando esisterà un lato admin, questo tipo andrà separato da una proiezione ammnistrativa completa.
export const UserFeedbackRef = builder.prismaObject('UserFeedback', {
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
