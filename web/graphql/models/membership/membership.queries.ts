import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import './index';

// Query utente (non-admin): piani attivi disponibili e piano corrente dell'utente autenticato.
// Protette solo da autenticazione, a differenza di adminMemberships (requireAdmin).

builder.queryField('membershipPlans', (t) =>
  t.prismaField({
    type: ['Membership'],
    resolve: async (query, _root, _args, ctx) => {
      if (!ctx.userId) {
        throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      return prisma.membership.findMany({ ...query, where: { deletedAt: null }, orderBy: { plan: 'asc' } });
    },
  }),
);

builder.queryField('myMembership', (t) =>
  t.prismaField({
    type: 'Membership',
    nullable: true,
    resolve: async (query, _root, _args, ctx) => {
      if (!ctx.userId) {
        throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      // Nessuna subscription attiva = piano FREE implicito (stessa convenzione di getAdminUserDetail)
      const subscription = await prisma.subscription.findFirst({
        where: { userId: ctx.userId, status: 'ACTIVE' },
        orderBy: { startDate: 'desc' },
        select: { membershipId: true },
      });
      if (!subscription) return null;
      return prisma.membership.findUnique({ ...query, where: { id: subscription.membershipId } });
    },
  }),
);
