import type { Group_User, GroupList, User } from '../../../prisma/generated/prisma/client';
import { builder } from '../../builder';
import { RolesGroupEnum } from '../../enum';
import { PublicUserRef } from '../friendship/index';

export type GroupMemberShape = Group_User & { user: User };

export const GroupMemberRef = builder.objectRef<GroupMemberShape>('GroupMember');
GroupMemberRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    userId: t.exposeID('userId'),
    role: t.field({ type: RolesGroupEnum, resolve: (m) => m.role }),
    autoUpdateItems: t.exposeBoolean('autoUpdateItems'),
    user: t.field({ type: PublicUserRef, resolve: (m) => m.user }),
  }),
});

export type GroupListShape = GroupList & { _count: { memberLists: number } };

export const GroupListRef = builder.objectRef<GroupListShape>('GroupList');
GroupListRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    icon: t.exposeString('icon'),
    color: t.exposeString('color'),
    description: t.exposeString('description', { nullable: true }),
    memberListCount: t.int({ resolve: (gl) => gl._count.memberLists }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});

export interface GroupSummaryShape {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  memberCount: number;
  myRole: string;
  createdAt: Date;
  updatedAt: Date;
}

export const GroupSummaryRef = builder.objectRef<GroupSummaryShape>('GroupSummary');
GroupSummaryRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    ownerId: t.exposeID('ownerId'),
    memberCount: t.exposeInt('memberCount'),
    myRole: t.exposeString('myRole'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});

// Invito pendente verso un utente non ancora membro (mostrato solmente a chi gestisce il gruppo)
export interface GroupPendingInviteShape {
  userId: string;
  username: string;
}

export const GroupPendingInviteRef = builder.objectRef<GroupPendingInviteShape>('GroupPendingInvite');
GroupPendingInviteRef.implement({
  fields: (t) => ({
    userId: t.exposeID('userId'),
    username: t.exposeString('username'),
  }),
});

export interface GroupDetailShape {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  members: GroupMemberShape[];
  groupLists: GroupListShape[];
  pendingInvites: GroupPendingInviteShape[];
  createdAt: Date;
  updatedAt: Date;
}

export const GroupDetailRef = builder.objectRef<GroupDetailShape>('GroupDetail');
GroupDetailRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    ownerId: t.exposeID('ownerId'),
    members: t.field({ type: [GroupMemberRef], resolve: (g) => g.members }),
    groupLists: t.field({ type: [GroupListRef], resolve: (g) => g.groupLists }),
    pendingInvites: t.field({ type: [GroupPendingInviteRef], resolve: (g) => g.pendingInvites }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});

export interface GroupInviteShape {
  id: string;
  groupId: string;
  groupName: string;
  sender: User;
  createdAt: Date;
}

export const GroupInviteRef = builder.objectRef<GroupInviteShape>('GroupInvite');
GroupInviteRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    groupId: t.exposeID('groupId'),
    groupName: t.exposeString('groupName'),
    sender: t.field({ type: PublicUserRef, resolve: (inv) => inv.sender }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
  }),
});
