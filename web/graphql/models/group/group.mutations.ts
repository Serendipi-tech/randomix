import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import { RolesGroupEnum } from '../../enum';
import { ItemRef } from '../item/index';
import { GroupDetailRef, GroupListRef } from './index';

type GroupRole = 'OWNER' | 'ADMIN' | 'AUTO_CONTRIBUTOR' | 'CONTRIBUTOR' | 'MEMBER';

function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

function requireRole(role: GroupRole, allowed: GroupRole[]): void {
  if (!allowed.includes(role)) {
    throw new GraphQLError('Permessi insufficienti.', { extensions: { code: 'FORBIDDEN' } });
  }
}

// ---- CRUD Gruppo ----

builder.mutationField('createGroup', (t) =>
  t.field({
    type: GroupDetailRef,
    args: {
      name: t.arg.string({ required: true }),
      description: t.arg.string({ required: false }),
    },
    resolve: async (_root, { name, description }, ctx) => {
      requireAuth(ctx.userId);
      return prisma.group.create({
        data: {
          name: name.trim(),
          description: description?.trim() ?? null,
          ownerId: ctx.userId,
          members: { create: { userId: ctx.userId, role: 'OWNER' } },
        },
        include: {
          members: { include: { user: true } },
          groupLists: { include: { _count: { select: { memberLists: true } } } },
        },
      });
    },
  }),
);

builder.mutationField('updateGroup', (t) =>
  t.field({
    type: GroupDetailRef,
    args: {
      groupId: t.arg.id({ required: true }),
      name: t.arg.string({ required: false }),
      description: t.arg.string({ required: false }),
    },
    resolve: async (_root, { groupId, name, description }, ctx) => {
      requireAuth(ctx.userId);
      const id = String(groupId);
      const membership = await prisma.group_User.findUnique({
        where: { groupId_userId: { groupId: id, userId: ctx.userId } },
      });
      if (!membership) throw new GraphQLError('Gruppo non trovato.', { extensions: { code: 'NOT_FOUND' } });
      requireRole(membership.role, ['OWNER', 'ADMIN']);
      return prisma.group.update({
        where: { id },
        data: {
          ...(name != null ? { name: name.trim() } : {}),
          ...(description !== undefined ? { description: description?.trim() ?? null } : {}),
        },
        include: {
          members: { include: { user: true } },
          groupLists: { include: { _count: { select: { memberLists: true } } } },
        },
      });
    },
  }),
);

builder.mutationField('deleteGroup', (t) =>
  t.boolean({
    args: { groupId: t.arg.id({ required: true }) },
    resolve: async (_root, { groupId }, ctx) => {
      requireAuth(ctx.userId);
      const group = await prisma.group.findFirst({ where: { id: String(groupId), ownerId: ctx.userId } });
      if (!group) throw new GraphQLError('Gruppo non trovato.', { extensions: { code: 'NOT_FOUND' } });
      await prisma.group.delete({ where: { id: group.id } });
      return true;
    },
  }),
);

// ---- Inviti ----

builder.mutationField('inviteToGroup', (t) =>
  t.boolean({
    args: {
      groupId: t.arg.id({ required: true }),
      userId: t.arg.id({ required: true }),
    },
    resolve: async (_root, { groupId, userId }, ctx) => {
      requireAuth(ctx.userId);
      const gId = String(groupId);
      const targetId = String(userId);

      const [membership, friendship, alreadyMember] = await Promise.all([
        prisma.group_User.findUnique({
          where: { groupId_userId: { groupId: gId, userId: ctx.userId } },
        }),
        prisma.friendship.findFirst({
          where: {
            status: 'ACCEPTED',
            OR: [
              { senderId: ctx.userId, receiverId: targetId },
              { senderId: targetId, receiverId: ctx.userId },
            ],
          },
        }),
        prisma.group_User.findUnique({
          where: { groupId_userId: { groupId: gId, userId: targetId } },
        }),
      ]);

      if (!membership) throw new GraphQLError('Gruppo non trovato.', { extensions: { code: 'NOT_FOUND' } });
      requireRole(membership.role, ['OWNER', 'ADMIN']);
      if (!friendship) throw new GraphQLError('Puoi invitare solo i tuoi amici.', { extensions: { code: 'FORBIDDEN' } });
      if (alreadyMember) throw new GraphQLError("L'utente è già nel gruppo.", { extensions: { code: 'CONFLICT' } });

      const group = await prisma.group.findUnique({ where: { id: gId }, select: { name: true } });
      const existing = await prisma.notification.findUnique({
        where: { senderId_receiverId_groupId: { senderId: ctx.userId, receiverId: targetId, groupId: gId } },
      });
      if (existing) await prisma.notification.delete({ where: { id: existing.id } });

      await prisma.notification.create({
        data: {
          title: `Invito nel gruppo "${group!.name}"`,
          notificationType: 'GROUP_INVITE',
          senderId: ctx.userId,
          receiverId: targetId,
          groupId: gId,
        },
      });
      return true;
    },
  }),
);

builder.mutationField('acceptGroupInvite', (t) =>
  t.boolean({
    args: { notificationId: t.arg.id({ required: true }) },
    resolve: async (_root, { notificationId }, ctx) => {
      requireAuth(ctx.userId);
      const notif = await prisma.notification.findFirst({
        where: { id: String(notificationId), receiverId: ctx.userId, notificationType: 'GROUP_INVITE' },
      });
      if (!notif?.groupId) throw new GraphQLError('Invito non trovato.', { extensions: { code: 'NOT_FOUND' } });

      const alreadyMember = await prisma.group_User.findUnique({
        where: { groupId_userId: { groupId: notif.groupId, userId: ctx.userId } },
      });
      if (!alreadyMember) {
        await prisma.group_User.create({
          data: { groupId: notif.groupId, userId: ctx.userId, role: 'MEMBER' },
        });
      }
      await prisma.notification.update({ where: { id: notif.id }, data: { markedAsRead: true } });
      return true;
    },
  }),
);

builder.mutationField('rejectGroupInvite', (t) =>
  t.boolean({
    args: { notificationId: t.arg.id({ required: true }) },
    resolve: async (_root, { notificationId }, ctx) => {
      requireAuth(ctx.userId);
      const notif = await prisma.notification.findFirst({
        where: { id: String(notificationId), receiverId: ctx.userId, notificationType: 'GROUP_INVITE' },
      });
      if (!notif) throw new GraphQLError('Invito non trovato.', { extensions: { code: 'NOT_FOUND' } });
      await prisma.notification.delete({ where: { id: notif.id } });
      return true;
    },
  }),
);

// ---- Gestione membri ----

builder.mutationField('leaveGroup', (t) =>
  t.boolean({
    args: { groupId: t.arg.id({ required: true }) },
    resolve: async (_root, { groupId }, ctx) => {
      requireAuth(ctx.userId);
      const id = String(groupId);
      const membership = await prisma.group_User.findUnique({
        where: { groupId_userId: { groupId: id, userId: ctx.userId } },
      });
      if (!membership) {
        throw new GraphQLError('Non sei membro di questo gruppo.', { extensions: { code: 'NOT_FOUND' } });
      }
      if (membership.role === 'OWNER') {
        const memberCount = await prisma.group_User.count({ where: { groupId: id } });
        if (memberCount > 1) {
          throw new GraphQLError('Trasferisci la proprietà prima di uscire.', { extensions: { code: 'FORBIDDEN' } });
        }
        // unico membro: elimina il gruppo
        await prisma.group.delete({ where: { id } });
        return true;
      }
      await prisma.group_User.delete({ where: { groupId_userId: { groupId: id, userId: ctx.userId } } });
      return true;
    },
  }),
);

builder.mutationField('removeGroupMember', (t) =>
  t.boolean({
    args: {
      groupId: t.arg.id({ required: true }),
      userId: t.arg.id({ required: true }),
    },
    resolve: async (_root, { groupId, userId }, ctx) => {
      requireAuth(ctx.userId);
      const gId = String(groupId);
      const targetId = String(userId);

      const [myMembership, target] = await Promise.all([
        prisma.group_User.findUnique({ where: { groupId_userId: { groupId: gId, userId: ctx.userId } } }),
        prisma.group_User.findUnique({ where: { groupId_userId: { groupId: gId, userId: targetId } } }),
      ]);

      if (!myMembership) throw new GraphQLError('Gruppo non trovato.', { extensions: { code: 'NOT_FOUND' } });
      requireRole(myMembership.role, ['OWNER', 'ADMIN']);
      if (!target) throw new GraphQLError('Membro non trovato.', { extensions: { code: 'NOT_FOUND' } });
      if (target.role === 'OWNER') {
        throw new GraphQLError('Non puoi rimuovere il proprietario.', { extensions: { code: 'FORBIDDEN' } });
      }
      await prisma.group_User.delete({ where: { groupId_userId: { groupId: gId, userId: targetId } } });
      return true;
    },
  }),
);

builder.mutationField('updateGroupMemberRole', (t) =>
  t.boolean({
    args: {
      groupId: t.arg.id({ required: true }),
      userId: t.arg.id({ required: true }),
      role: t.arg({ type: RolesGroupEnum, required: true }),
    },
    resolve: async (_root, { groupId, userId, role }, ctx) => {
      requireAuth(ctx.userId);
      const gId = String(groupId);
      const targetId = String(userId);

      const [myMembership, target] = await Promise.all([
        prisma.group_User.findUnique({ where: { groupId_userId: { groupId: gId, userId: ctx.userId } } }),
        prisma.group_User.findUnique({ where: { groupId_userId: { groupId: gId, userId: targetId } } }),
      ]);

      if (!myMembership || myMembership.role !== 'OWNER') {
        throw new GraphQLError('Solo il proprietario può modificare i ruoli.', { extensions: { code: 'FORBIDDEN' } });
      }
      if (!target) throw new GraphQLError('Membro non trovato.', { extensions: { code: 'NOT_FOUND' } });

      // se si trasferisce la proprietà, il vecchio owner diventa ADMIN
      if (role === 'OWNER') {
        await prisma.$transaction([
          prisma.group_User.update({
            where: { groupId_userId: { groupId: gId, userId: ctx.userId } },
            data: { role: 'ADMIN' },
          }),
          prisma.group_User.update({
            where: { groupId_userId: { groupId: gId, userId: targetId } },
            data: { role: 'OWNER' },
          }),
          prisma.group.update({ where: { id: gId }, data: { ownerId: targetId } }),
        ]);
        return true;
      }

      await prisma.group_User.update({
        where: { groupId_userId: { groupId: gId, userId: targetId } },
        data: { role },
      });
      return true;
    },
  }),
);

// ---- GroupList ----

builder.mutationField('createGroupList', (t) =>
  t.field({
    type: GroupListRef,
    args: {
      groupId: t.arg.id({ required: true }),
      name: t.arg.string({ required: true }),
      icon: t.arg.string({ required: true }),
      color: t.arg.string({ required: true }),
      description: t.arg.string({ required: false }),
    },
    resolve: async (_root, { groupId, name, icon, color, description }, ctx) => {
      requireAuth(ctx.userId);
      const gId = String(groupId);
      const membership = await prisma.group_User.findUnique({
        where: { groupId_userId: { groupId: gId, userId: ctx.userId } },
      });
      if (!membership) throw new GraphQLError('Gruppo non trovato.', { extensions: { code: 'NOT_FOUND' } });
      requireRole(membership.role, ['OWNER', 'ADMIN']);
      return prisma.groupList.create({
        data: {
          groupId: gId,
          creatorId: ctx.userId,
          name: name.trim(),
          icon,
          color,
          description: description?.trim() ?? null,
        },
        include: { _count: { select: { memberLists: true } } },
      });
    },
  }),
);

builder.mutationField('deleteGroupList', (t) =>
  t.boolean({
    args: { groupListId: t.arg.id({ required: true }) },
    resolve: async (_root, { groupListId }, ctx) => {
      requireAuth(ctx.userId);
      const glId = String(groupListId);
      const groupList = await prisma.groupList.findUnique({
        where: { id: glId },
        select: { groupId: true },
      });
      if (!groupList) throw new GraphQLError('Lista gruppo non trovata.', { extensions: { code: 'NOT_FOUND' } });
      const membership = await prisma.group_User.findUnique({
        where: { groupId_userId: { groupId: groupList.groupId, userId: ctx.userId } },
      });
      if (!membership) throw new GraphQLError('Non autorizzato.', { extensions: { code: 'FORBIDDEN' } });
      requireRole(membership.role, ['OWNER', 'ADMIN']);
      await prisma.groupList.delete({ where: { id: glId } });
      return true;
    },
  }),
);

builder.mutationField('addListToGroupList', (t) =>
  t.boolean({
    args: {
      groupListId: t.arg.id({ required: true }),
      listId: t.arg.id({ required: true }),
    },
    resolve: async (_root, { groupListId, listId }, ctx) => {
      requireAuth(ctx.userId);
      const glId = String(groupListId);
      const lId = String(listId);

      const groupList = await prisma.groupList.findUnique({
        where: { id: glId },
        select: { groupId: true },
      });
      if (!groupList) throw new GraphQLError('Lista gruppo non trovata.', { extensions: { code: 'NOT_FOUND' } });

      const [membership, list] = await Promise.all([
        prisma.group_User.findUnique({
          where: { groupId_userId: { groupId: groupList.groupId, userId: ctx.userId } },
        }),
        prisma.list.findFirst({ where: { id: lId, userId: ctx.userId } }),
      ]);
      if (!membership) throw new GraphQLError('Non sei membro di questo gruppo.', { extensions: { code: 'FORBIDDEN' } });
      if (!list) throw new GraphQLError('Lista non trovata.', { extensions: { code: 'NOT_FOUND' } });

      await prisma.groupList.update({
        where: { id: glId },
        data: { memberLists: { connect: { id: lId } } },
      });
      return true;
    },
  }),
);

builder.mutationField('removeListFromGroupList', (t) =>
  t.boolean({
    args: {
      groupListId: t.arg.id({ required: true }),
      listId: t.arg.id({ required: true }),
    },
    resolve: async (_root, { groupListId, listId }, ctx) => {
      requireAuth(ctx.userId);
      const glId = String(groupListId);
      const lId = String(listId);

      const groupList = await prisma.groupList.findUnique({
        where: { id: glId },
        select: { groupId: true },
      });
      if (!groupList) throw new GraphQLError('Lista gruppo non trovata.', { extensions: { code: 'NOT_FOUND' } });

      const [membership, list] = await Promise.all([
        prisma.group_User.findUnique({
          where: { groupId_userId: { groupId: groupList.groupId, userId: ctx.userId } },
        }),
        prisma.list.findFirst({ where: { id: lId, userId: ctx.userId } }),
      ]);
      if (!membership) throw new GraphQLError('Non sei membro di questo gruppo.', { extensions: { code: 'FORBIDDEN' } });
      if (!list) throw new GraphQLError('Lista non trovata.', { extensions: { code: 'NOT_FOUND' } });

      await prisma.groupList.update({
        where: { id: glId },
        data: { memberLists: { disconnect: { id: lId } } },
      });
      return true;
    },
  }),
);

// ---- Draw di gruppo ----

builder.mutationField('drawFromGroupList', (t) =>
  t.field({
    type: ItemRef,
    args: {
      groupListId: t.arg.id({ required: true }),
      previousItemId: t.arg.id({ required: false }),
    },
    resolve: async (_root, { groupListId, previousItemId }, ctx) => {
      requireAuth(ctx.userId);
      const glId = String(groupListId);

      const groupList = await prisma.groupList.findUnique({
        where: { id: glId },
        select: { groupId: true },
      });
      if (!groupList) throw new GraphQLError('Lista gruppo non trovata.', { extensions: { code: 'NOT_FOUND' } });

      const membership = await prisma.group_User.findUnique({
        where: { groupId_userId: { groupId: groupList.groupId, userId: ctx.userId } },
      });
      if (!membership) throw new GraphQLError('Non sei membro.', { extensions: { code: 'FORBIDDEN' } });

      const listUserItems = await prisma.list_UserItem.findMany({
        where: {
          list: { groupLists: { some: { id: glId } } },
          ...(previousItemId
            ? { userItem: { itemId: { not: String(previousItemId) } } }
            : {}),
        },
        include: { userItem: { select: { itemId: true } } },
      });

      // deduplica per itemId
      const seen = new Set<string>();
      const itemIds: string[] = [];
      for (const lui of listUserItems) {
        const iId = lui.userItem.itemId;
        if (!seen.has(iId)) {
          seen.add(iId);
          itemIds.push(iId);
        }
      }
      if (itemIds.length === 0) {
        throw new GraphQLError('Nessun elemento estraibile.', { extensions: { code: 'EMPTY_LIST' } });
      }
      const drawnId = itemIds[Math.floor(Math.random() * itemIds.length)];
      return prisma.item.findUniqueOrThrow({ where: { id: drawnId } });
    },
  }),
);

builder.mutationField('acceptGroupDraw', (t) =>
  t.boolean({
    args: {
      groupListId: t.arg.id({ required: true }),
      itemId: t.arg.id({ required: true }),
    },
    resolve: async (_root, { groupListId, itemId }, ctx) => {
      requireAuth(ctx.userId);
      const glId = String(groupListId);

      const groupList = await prisma.groupList.findUnique({
        where: { id: glId },
        select: { groupId: true },
      });
      if (!groupList) throw new GraphQLError('Lista gruppo non trovata.', { extensions: { code: 'NOT_FOUND' } });

      const [myMembership, members] = await Promise.all([
        prisma.group_User.findUnique({
          where: { groupId_userId: { groupId: groupList.groupId, userId: ctx.userId } },
        }),
        prisma.group_User.findMany({
          where: { groupId: groupList.groupId },
          select: { id: true },
        }),
      ]);
      if (!myMembership) throw new GraphQLError('Non sei membro.', { extensions: { code: 'FORBIDDEN' } });

      await prisma.groupList_AcceptedItemHistory.create({
        data: {
          groupListId: glId,
          itemId: String(itemId),
          randomizingFor: { connect: members.map((m) => ({ id: m.id })) },
        },
      });
      return true;
    },
  }),
);
