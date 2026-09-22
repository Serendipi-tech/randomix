import { builder, prisma } from '../../builder';
import { CategoryEnum, StatusCompletionEnum } from '../../enum';
import { RatingRef } from '../rating/index';

// Limite di sicurezza sull'elenco recensioni: nessuna paginazione richiesta, solo un tetto ragionevole
const REVIEWS_LIMIT = 100;

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
    // media di TUTTI i voti (compreso il mio): il rating generale è un dato collettivo, non un'opinione personale
    averageRating: t.float({
      nullable: true,
      resolve: async (item) => {
        const agg = await prisma.rating.aggregate({ where: { itemId: item.id }, _avg: { value: true } });
        return agg._avg.value;
      },
    }),
    ratingsCount: t.int({
      resolve: (item) => prisma.rating.count({ where: { itemId: item.id } }),
    }),
    // voti degli ALTRI utenti (il mio ha la sua sezione a parte): amici prima, poi per data di aggiornamento
    reviews: t.field({
      type: [RatingRef],
      resolve: async (item, _args, ctx) => {
        const ratings = await prisma.rating.findMany({
          where: { itemId: item.id, ...(ctx.userId ? { userId: { not: ctx.userId } } : {}) },
          orderBy: { updatedAt: 'desc' },
          take: REVIEWS_LIMIT,
        });
        if (!ctx.userId || ratings.length === 0) return ratings;
        const friendships = await prisma.friendship.findMany({
          where: { status: 'ACCEPTED', OR: [{ senderId: ctx.userId }, { receiverId: ctx.userId }] },
        });
        const friendIds = new Set(friendships.map((f) => (f.senderId === ctx.userId ? f.receiverId : f.senderId)));
        // sort stabile: a parità di amicizia resta l'ordine per data già applicato sopra
        return [...ratings].sort((a, b) => {
          const aFriend = a.userId ? friendIds.has(a.userId) : false;
          const bFriend = b.userId ? friendIds.has(b.userId) : false;
          if (aFriend === bFriend) return 0;
          return aFriend ? -1 : 1;
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
