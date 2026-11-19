import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import { ProfileStatsRef, type ProfileStatsShape } from '../profileStats/index';
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

interface CategoryAccumulator {
  name: string;
  icon: string;
  itemsCount: number;
  drawCount: number;
}

// Stessa aggregazione di profileStats.queries.ts, ma parametrizzata per un userId arbitrario
// (qui serve per un amico, non per l'utente autenticato). Quel file resta fuori dallo scope
// di modifica di questo task: la logica è replicata invece di essere estratta in un helper condiviso.
async function computeProfileStatsForUser(userId: string): Promise<ProfileStatsShape> {
  const [items, listUserItems, notStarted, inProgress, completed, drawAgg] = await Promise.all([
    prisma.user_Item.findMany({
      where: { userId },
      select: { categoryId: true, category: { select: { name: true, icon: true } } },
    }),
    prisma.list_UserItem.findMany({
      where: { userItem: { userId } },
      select: { count: true, userItem: { select: { categoryId: true, category: { select: { name: true, icon: true } } } } },
    }),
    prisma.user_Item.count({ where: { userId, status: 'NOT_STARTED' } }),
    prisma.user_Item.count({ where: { userId, status: 'IN_PROGRESS' } }),
    prisma.user_Item.count({ where: { userId, status: 'COMPLETED' } }),
    prisma.list_UserItem.aggregate({
      where: { userItem: { userId } },
      _sum: { acceptedCount: true, skippedCount: true },
    }),
  ]);

  const byCategory = new Map<string, CategoryAccumulator>();
  for (const item of items) {
    const entry = byCategory.get(item.categoryId) ?? {
      name: item.category.name,
      icon: item.category.icon,
      itemsCount: 0,
      drawCount: 0,
    };
    entry.itemsCount += 1;
    byCategory.set(item.categoryId, entry);
  }
  for (const row of listUserItems) {
    const { categoryId, category } = row.userItem;
    const entry = byCategory.get(categoryId) ?? {
      name: category.name,
      icon: category.icon,
      itemsCount: 0,
      drawCount: 0,
    };
    entry.drawCount += row.count;
    byCategory.set(categoryId, entry);
  }

  const categoryStats = Array.from(byCategory.entries())
    .map(([categoryId, v]) => ({ categoryId, ...v }))
    .sort((a, b) => b.itemsCount - a.itemsCount);

  return {
    categoryStats,
    completionBreakdown: { notStarted, inProgress, completed },
    drawAcceptance: {
      accepted: drawAgg._sum.acceptedCount ?? 0,
      skipped: drawAgg._sum.skippedCount ?? 0,
    },
  };
}

// Campo aggiuntivo su FriendProfile, definito qui invece che in index.ts (fuori scope):
// Pothos permette di estendere un objectRef già implementato da un altro file.
builder.objectFields(FriendProfileRef, (t) => ({
  stats: t.field({
    type: ProfileStatsRef,
    resolve: (parent) => computeProfileStatsForUser(parent.user.id),
  }),
}));

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
