import type { Friendship, List, User } from '../../../prisma/generated/prisma/client';
import { builder } from '../../builder';

// Profilo pubblico di un altro utente: mai esporre email o campi sensibili
export const PublicUserRef = builder.objectRef<User>('PublicUser');

PublicUserRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    username: t.exposeString('username'),
    avatarUrl: t.exposeString('avatarUrl', { nullable: true }),
  }),
});

// Relazione tra l'utente corrente e un utente trovato in ricerca
export type FriendRelation = 'NONE' | 'FRIEND' | 'REQUEST_SENT' | 'REQUEST_RECEIVED';

export const FriendRelationEnum = builder.enumType('FRIEND_RELATION', {
  values: ['NONE', 'FRIEND', 'REQUEST_SENT', 'REQUEST_RECEIVED'] as const,
});

export const FriendRequestRef = builder.objectRef<Friendship & { sender: User }>('FriendRequest');

FriendRequestRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    sender: t.field({ type: PublicUserRef, resolve: (parent) => parent.sender }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
  }),
});

interface UserSearchResultShape {
  user: User;
  relation: FriendRelation;
}

export const UserSearchResultRef = builder.objectRef<UserSearchResultShape>('UserSearchResult');

UserSearchResultRef.implement({
  fields: (t) => ({
    user: t.field({ type: PublicUserRef, resolve: (parent) => parent.user }),
    relation: t.field({ type: FriendRelationEnum, resolve: (parent) => parent.relation }),
  }),
});

// Lista visibile di un amico: solo i campi pubblici, niente items
type FriendListShape = List & { _count: { items: number } };

export const FriendListRef = builder.objectRef<FriendListShape>('FriendList');

FriendListRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    icon: t.exposeString('icon'),
    color: t.exposeString('color'),
    description: t.exposeString('description', { nullable: true }),
    itemCount: t.int({ resolve: (parent) => parent._count.items }),
  }),
});

interface FriendProfileShape {
  user: User;
  lists: FriendListShape[];
}

export const FriendProfileRef = builder.objectRef<FriendProfileShape>('FriendProfile');

FriendProfileRef.implement({
  fields: (t) => ({
    user: t.field({ type: PublicUserRef, resolve: (parent) => parent.user }),
    lists: t.field({ type: [FriendListRef], resolve: (parent) => parent.lists }),
  }),
});
