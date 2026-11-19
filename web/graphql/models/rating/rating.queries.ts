import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import './index';

function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

builder.queryField('friendRatingsForItem', (t) =>
  t.prismaField({
    type: ['Rating'],
    args: { userItemId: t.arg.id({ required: true }) },
    resolve: async (query, _root, { userItemId }, ctx) => {
      requireAuth(ctx.userId);
      const userItem = await prisma.user_Item.findFirst({
        where: { id: String(userItemId), userId: ctx.userId },
      });
      if (!userItem) {
        throw new GraphQLError('Elemento non trovato.', { extensions: { code: 'NOT_FOUND' } });
      }

      const friendships = await prisma.friendship.findMany({
        where: {
          status: 'ACCEPTED',
          OR: [{ senderId: ctx.userId }, { receiverId: ctx.userId }],
        },
      });
      const friendIds = friendships.map((f) => (f.senderId === ctx.userId ? f.receiverId : f.senderId));
      if (friendIds.length === 0) return [];

      // stesso item "logico" = stesso nome+categoria, dato che gli item sono personali per utente (vedi item.prisma)
      const friendItems = await prisma.user_Item.findMany({
        where: {
          userId: { in: friendIds },
          name: userItem.name,
          categoryId: userItem.categoryId,
          isHidden: false,
        },
        select: { id: true },
      });
      if (friendItems.length === 0) return [];

      return prisma.rating.findMany({
        ...query,
        where: { userItemId: { in: friendItems.map((item) => item.id) } },
        orderBy: { updatedAt: 'desc' },
      });
    },
  }),
);
