import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import { PublicUserRef } from './index';

builder.queryField('myFriends', (t) =>
  t.field({
    type: [PublicUserRef],
    resolve: async (_root, _args, ctx) => {
      if (!ctx.userId) {
        throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      const friendships = await prisma.friendship.findMany({
        where: {
          status: 'ACCEPTED',
          OR: [{ senderId: ctx.userId }, { receiverId: ctx.userId }],
        },
        include: { sender: true, receiver: true },
        orderBy: { updatedAt: 'desc' },
      });
      // ritorno sempre "l'altro" utente della coppia
      return friendships.map((f) => (f.senderId === ctx.userId ? f.receiver : f.sender));
    },
  }),
);
