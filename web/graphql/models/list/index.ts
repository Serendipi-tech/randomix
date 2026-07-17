import type { List } from '../../../prisma/generated/prisma/client';
import { builder } from '../../builder';

export const ListRef = builder.prismaObject('List', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    icon: t.exposeString('icon'),
    color: t.exposeString('color'),
    description: t.exposeString('description', { nullable: true }),
    isHidden: t.exposeBoolean('isHidden'),
    isGiftedAtRegistration: t.exposeBoolean('isGiftedAtRegistration'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});

interface MyListsPayloadShape {
  lists: List[];
  nextCursor: string | null;
}

export const MyListsPayloadRef = builder.objectRef<MyListsPayloadShape>('MyListsPayload');

MyListsPayloadRef.implement({
  fields: (t) => ({
    lists: t.field({
      type: [ListRef],
      resolve: (parent) => parent.lists,
    }),
    nextCursor: t.exposeString('nextCursor', { nullable: true }),
  }),
});
