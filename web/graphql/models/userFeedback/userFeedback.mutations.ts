import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import { FeedbackTypeEnum } from '../../enum';
import './index';

const TEXT_MAX_LENGTH = 3000;

function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new GraphQLError('Not authenticated.', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

builder.mutationField('createUserFeedback', (t) =>
  t.prismaField({
    type: 'UserFeedback',
    args: {
      type: t.arg({ type: FeedbackTypeEnum, required: true }),
      title: t.arg.string({ required: false }),
      text: t.arg.string({ required: true }),
      page: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, { type, title, text, page }, ctx) => {
      requireAuth(ctx.userId);
      if (text.length > TEXT_MAX_LENGTH) {
        throw new GraphQLError(`Feedback text cannot exceed ${TEXT_MAX_LENGTH} characters.`, {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      return prisma.userFeedback.create({
        ...query,
        data: { userId: ctx.userId, type, title: title ?? null, text, page },
      });
    },
  }),
);

builder.mutationField('deleteUserFeedback', (t) =>
  t.boolean({
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      requireAuth(ctx.userId);
      const feedback = await prisma.userFeedback.findUnique({ where: { id: String(id) } });
      // Messaggio generico anche se il feedback appartiene a un altro utente: non rivela l'esistenza altrui.
      if (!feedback || feedback.userId !== ctx.userId) {
        throw new GraphQLError('Feedback not found.', { extensions: { code: 'NOT_FOUND' } });
      }
      if (feedback.status !== 'SENT') {
        throw new GraphQLError('This feedback is already being reviewed and can no longer be deleted.', {
          extensions: { code: 'FEEDBACK_IN_PROGRESS' },
        });
      }
      if (feedback.isImportant) {
        throw new GraphQLError('This feedback has been flagged and can no longer be deleted.', {
          extensions: { code: 'FEEDBACK_FLAGGED' },
        });
      }
      await prisma.userFeedback.delete({ where: { id: feedback.id } });
      return true;
    },
  }),
);
