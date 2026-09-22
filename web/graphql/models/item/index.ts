import { builder, prisma } from '../../builder';
import { StatusCompletionEnum } from '../../enum';
import { RatingRef } from '../rating/index';

export const UserItemRef = builder.prismaObject('User_Item', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    note: t.exposeString('note', { nullable: true }),
    status: t.field({
      type: StatusCompletionEnum,
      resolve: (userItem) => userItem.status,
    }),
    completedAt: t.expose('completedAt', { type: 'DateTime', nullable: true }),
    isHidden: t.exposeBoolean('isHidden'),
    category: t.relation('category'),
    tags: t.relation('tags'),
    // voto personale: un item è già scoped a un utente, quindi al massimo un rating
    rating: t.field({
      type: RatingRef,
      nullable: true,
      resolve: (userItem, _args, ctx) => {
        if (!ctx.userId) return null;
        return prisma.rating.findUnique({
          where: { userId_userItemId: { userId: ctx.userId, userItemId: userItem.id } },
        });
      },
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});
