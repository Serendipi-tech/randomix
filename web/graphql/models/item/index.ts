import { builder } from '../../builder';
import { CategoryEnum, StatusCompletionEnum } from '../../enum';

export const ItemRef = builder.prismaObject('Item', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    imageUrl: t.exposeString('imageUrl', { nullable: true }),
    category: t.field({
      type: CategoryEnum,
      resolve: (item) => item.category,
    }),
  }),
});

export const UserItemRef = builder.prismaObject('User_Item', {
  fields: (t) => ({
    id: t.exposeID('id'),
    description: t.exposeString('description', { nullable: true }),
    note: t.exposeString('note', { nullable: true }),
    status: t.field({
      type: StatusCompletionEnum,
      resolve: (userItem) => userItem.status,
    }),
    completedAt: t.expose('completedAt', { type: 'DateTime', nullable: true }),
    isHidden: t.exposeBoolean('isHidden'),
    item: t.relation('item'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});
