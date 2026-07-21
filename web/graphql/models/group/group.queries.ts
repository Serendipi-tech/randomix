import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import { ItemRef } from '../item/index';
import { GroupDetailRef, GroupInviteRef, GroupSummaryRef } from './index';

function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

builder.queryField('myGroups', (t) =>
  t.field({
    type: [GroupSummaryRef],
    resolve: async (_root, _args, ctx) => {
      requireAuth(ctx.userId);
      const memberships = await prisma.group_User.findMany({
        where: { userId: ctx.userId },
        include: { group: { include: { _count: { select: { members: true } } } } },
        orderBy: { createdAt: 'desc' },
      });
      return memberships.map((m) => ({
        id: m.group.id,
        name: m.group.name,
        description: m.group.description,
        ownerId: m.group.ownerId,
        memberCount: m.group._count.members,
        myRole: m.role,
        createdAt: m.group.createdAt,
        updatedAt: m.group.updatedAt,
      }));
    },
  }),
);

builder.queryField('groupDetail', (t) =>
  t.field({
    type: GroupDetailRef,
    args: { groupId: t.arg.id({ required: true }) },
    resolve: async (_root, { groupId }, ctx) => {
      requireAuth(ctx.userId);
      const id = String(groupId);
      const membership = await prisma.group_User.findUnique({
        where: { groupId_userId: { groupId: id, userId: ctx.userId } },
      });
      if (!membership) {
        throw new GraphQLError('Gruppo non trovato.', { extensions: { code: 'NOT_FOUND' } });
      }
      const group = await prisma.group.findUnique({
        where: { id },
        include: {
          members: { include: { user: true }, orderBy: { createdAt: 'asc' } },
          groupLists: {
            include: { _count: { select: { memberLists: true } } },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
      if (!group) {
        throw new GraphQLError('Gruppo non trovato.', { extensions: { code: 'NOT_FOUND' } });
      }

      // inviti pendenti (non letti) verso utenti non ancora membri, deduplicati per destinatario
      const memberIds = new Set(group.members.map((m) => m.userId));
      const pendingNotifs = await prisma.notification.findMany({
        where: { groupId: id, notificationType: 'GROUP_INVITE', markedAsRead: false },
        include: { receiver: { select: { id: true, username: true } } },
        orderBy: { createdAt: 'desc' },
      });
      const pendingMap = new Map<string, { userId: string; username: string }>();
      for (const n of pendingNotifs) {
        if (memberIds.has(n.receiver.id) || pendingMap.has(n.receiver.id)) continue;
        pendingMap.set(n.receiver.id, { userId: n.receiver.id, username: n.receiver.username });
      }

      return { ...group, pendingInvites: [...pendingMap.values()] };
    },
  }),
);

builder.queryField('myGroupInvites', (t) =>
  t.field({
    type: [GroupInviteRef],
    resolve: async (_root, _args, ctx) => {
      requireAuth(ctx.userId);
      const notifications = await prisma.notification.findMany({
        where: {
          receiverId: ctx.userId,
          notificationType: 'GROUP_INVITE',
          markedAsRead: false,
          groupId: { not: null },
        },
        include: { sender: true, group: true },
        orderBy: { createdAt: 'desc' },
      });
      return notifications
        .filter((n) => n.sender && n.group)
        .map((n) => ({
          id: n.id,
          groupId: n.groupId!,
          groupName: n.group!.name,
          sender: n.sender!,
          createdAt: n.createdAt,
        }));
    },
  }),
);

builder.queryField('groupListMergedItems', (t) =>
  t.field({
    type: [ItemRef],
    args: { groupListId: t.arg.id({ required: true }) },
    resolve: async (_root, { groupListId }, ctx) => {
      requireAuth(ctx.userId);
      const glId = String(groupListId);
      const groupList = await prisma.groupList.findUnique({
        where: { id: glId },
        select: { groupId: true },
      });
      if (!groupList) {
        throw new GraphQLError('Lista gruppo non trovata.', { extensions: { code: 'NOT_FOUND' } });
      }
      const membership = await prisma.group_User.findUnique({
        where: { groupId_userId: { groupId: groupList.groupId, userId: ctx.userId } },
      });
      if (!membership) {
        throw new GraphQLError('Non sei membro di questo gruppo.', { extensions: { code: 'FORBIDDEN' } });
      }
      const listUserItems = await prisma.list_UserItem.findMany({
        where: { list: { groupLists: { some: { id: glId } } } },
        include: { userItem: { include: { item: true } } },
      });
      const seen = new Set<string>();
      const items = [];
      for (const lui of listUserItems) {
        const item = lui.userItem.item;
        if (!seen.has(item.id)) {
          seen.add(item.id);
          items.push(item);
        }
      }
      return items;
    },
  }),
);

// ID delle liste dell'utente corrente già condivise in questa GroupList (per i toggle condividi/rimuovi)
builder.queryField('groupListSharedListIds', (t) =>
  t.field({
    type: ['ID'],
    args: { groupListId: t.arg.id({ required: true }) },
    resolve: async (_root, { groupListId }, ctx) => {
      requireAuth(ctx.userId);
      const glId = String(groupListId);
      const groupList = await prisma.groupList.findUnique({
        where: { id: glId },
        select: { groupId: true },
      });
      if (!groupList) {
        throw new GraphQLError('Lista gruppo non trovata.', { extensions: { code: 'NOT_FOUND' } });
      }
      const membership = await prisma.group_User.findUnique({
        where: { groupId_userId: { groupId: groupList.groupId, userId: ctx.userId } },
      });
      if (!membership) {
        throw new GraphQLError('Non sei membro di questo gruppo.', { extensions: { code: 'FORBIDDEN' } });
      }
      const lists = await prisma.list.findMany({
        where: { userId: ctx.userId, groupLists: { some: { id: glId } } },
        select: { id: true },
      });
      return lists.map((l) => l.id);
    },
  }),
);
