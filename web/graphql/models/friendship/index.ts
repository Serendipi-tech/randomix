import type { Category, Friendship, List, User, User_Item } from '../../../prisma/generated/prisma/client';
import { builder, prisma } from '../../builder';
import { StatusCompletionEnum } from '../../enum';
import { CategoryRef } from '../category/index';

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

// Richiesta d'amicizia inviata dall'utente corrente: qui l'altro capo della coppia è il destinatario
export const SentFriendRequestRef = builder.objectRef<Friendship & { receiver: User }>('SentFriendRequest');

SentFriendRequestRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    receiver: t.field({ type: PublicUserRef, resolve: (parent) => parent.receiver }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
  }),
});

// Richiesta ricevuta e gia' chiusa: resta nel feed come voce storica, con l'esito
export const AnsweredFriendRequestRef = builder.objectRef<Friendship & { sender: User }>(
  'AnsweredFriendRequest',
);

AnsweredFriendRequestRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    sender: t.field({ type: PublicUserRef, resolve: (parent) => parent.sender }),
    accepted: t.boolean({ resolve: (parent) => parent.status === 'ACCEPTED' }),
    answeredAt: t.expose('updatedAt', { type: 'DateTime' }),
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

// Item di una lista di un amico: sola lettura, stessa forma usata altrove per mostrare un item (nome, categoria, stato, nota)
type FriendListItemShape = User_Item & { category: Category };

export const FriendListItemRef = builder.objectRef<FriendListItemShape>('FriendListItem');

FriendListItemRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    note: t.exposeString('note', { nullable: true }),
    status: t.field({ type: StatusCompletionEnum, resolve: (parent) => parent.status }),
    category: t.field({ type: CategoryRef, resolve: (parent) => parent.category }),
  }),
});

// Lista visibile di un amico: campi pubblici + items (filtrati isHidden:false sia a livello di lista, a monte, sia di singolo item qui)
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
    items: t.field({
      type: [FriendListItemRef],
      resolve: async (parent) => {
        const rows = await prisma.list_UserItem.findMany({
          where: { listId: parent.id, userItem: { isHidden: false } },
          include: { userItem: { include: { category: true } } },
        });
        return rows.map((row) => row.userItem);
      },
    }),
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
