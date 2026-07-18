import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import {
  FriendProfileRef,
  FriendRequestRef,
  PublicUserRef,
  UserSearchResultRef,
  type FriendRelation,
} from './index';

const SEARCH_LIMIT = 10;
const SEARCH_MIN_LENGTH = 2;

function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

builder.queryField('myFriends', (t) =>
  t.field({
    type: [PublicUserRef],
    resolve: async (_root, _args, ctx) => {
      requireAuth(ctx.userId);
      const friendships = await prisma.friendship.findMany({
        where: {
          status: 'ACCEPTED',
          OR: [{ senderId: ctx.userId }, { receiverId: ctx.userId }],
        },
        include: { sender: true, receiver: true },
        orderBy: { updatedAt: 'desc' },
      });
      // ritorno sempre "l'altro" utente della coppia
      return friendships.map((f) => (f.senderId === ctx.userId ? f.receiver : f.sender));
    },
  }),
);

builder.queryField('friendRequests', (t) =>
  t.field({
    type: [FriendRequestRef],
    resolve: async (_root, _args, ctx) => {
      requireAuth(ctx.userId);
      return prisma.friendship.findMany({
        where: { receiverId: ctx.userId, status: 'PENDING' },
        include: { sender: true },
        orderBy: { createdAt: 'desc' },
      });
    },
  }),
);

builder.queryField('searchUsers', (t) =>
  t.field({
    type: [UserSearchResultRef],
    args: { query: t.arg.string({ required: true }) },
    resolve: async (_root, { query }, ctx) => {
      requireAuth(ctx.userId);
      const term = query.trim();
      if (term.length < SEARCH_MIN_LENGTH) return [];
      const users = await prisma.user.findMany({
        where: {
          id: { not: ctx.userId },
          deletedAt: null,
          // username per sottostringa, email solo per corrispondenza esatta
          OR: [
            { username: { contains: term, mode: 'insensitive' } },
            { email: { equals: term, mode: 'insensitive' } },
          ],
        },
        take: SEARCH_LIMIT,
        orderBy: { username: 'asc' },
      });
      if (users.length === 0) return [];
      const ids = users.map((u) => u.id);
      const friendships = await prisma.friendship.findMany({
        where: {
          OR: [
            { senderId: ctx.userId, receiverId: { in: ids } },
            { receiverId: ctx.userId, senderId: { in: ids } },
          ],
        },
      });
      return users.map((user) => {
        const f = friendships.find((fr) => fr.senderId === user.id || fr.receiverId === user.id);
        let relation: FriendRelation = 'NONE';
        if (f?.status === 'ACCEPTED') relation = 'FRIEND';
        else if (f?.status === 'PENDING') {
          relation = f.senderId === ctx.userId ? 'REQUEST_SENT' : 'REQUEST_RECEIVED';
        }
        return { user, relation };
      });
    },
  }),
);

builder.queryField('friendProfile', (t) =>
  t.field({
    type: FriendProfileRef,
    args: { userId: t.arg.id({ required: true }) },
    resolve: async (_root, { userId }, ctx) => {
      requireAuth(ctx.userId);
      const otherId = String(userId);
      // il profilo è visibile solo agli amici accettati
      const friendship = await prisma.friendship.findFirst({
        where: {
          status: 'ACCEPTED',
          OR: [
            { senderId: ctx.userId, receiverId: otherId },
            { senderId: otherId, receiverId: ctx.userId },
          ],
        },
      });
      if (!friendship) {
        throw new GraphQLError('Amico non trovato.', { extensions: { code: 'NOT_FOUND' } });
      }
      const user = await prisma.user.findUnique({ where: { id: otherId } });
      if (!user) {
        throw new GraphQLError('Amico non trovato.', { extensions: { code: 'NOT_FOUND' } });
      }
      const lists = await prisma.list.findMany({
        where: { userId: otherId, isHidden: false },
        include: { _count: { select: { items: true } } },
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      });
      return { user, lists };
    },
  }),
);
