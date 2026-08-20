import { builder, prisma } from '../../builder';
import { PublicUserRef } from '../friendship/index';

export const RatingRef = builder.prismaObject('Rating', {
  fields: (t) => ({
    id: t.exposeID('id'),
    value: t.exposeInt('value'),
    note: t.exposeString('note', { nullable: true }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    // null se l'autore ha eliminato l'account (Rating.userId è onDelete: SetNull)
    user: t.field({
      type: PublicUserRef,
      nullable: true,
      resolve: (rating) => (rating.userId ? prisma.user.findUnique({ where: { id: rating.userId } }) : null),
    }),
  }),
});
