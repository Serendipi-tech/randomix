import { builder, prisma } from '../../builder';
import { CategoryEnum, StatusCompletionEnum } from '../../enum';
import { RatingRef } from '../rating/index';

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
    // voto dell'utente autenticato per questo item (indipendente dalle liste)
    myRating: t.field({
      type: RatingRef,
      nullable: true,
      resolve: (item, _args, ctx) => {
        if (!ctx.userId) return null;
        return prisma.rating.findUnique({
          where: { userId_itemId: { userId: ctx.userId, itemId: item.id } },
        });
      },
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
    tags: t.relation('tags'),
    item: t.relation('item'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});
