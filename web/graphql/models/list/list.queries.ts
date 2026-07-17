import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import { MyListsPayloadRef } from './index';

const DEFAULT_PAGE_SIZE = 20;

builder.queryField('myLists', (t) =>
  t.field({
    type: MyListsPayloadRef,
    args: {
      limit: t.arg.int({ required: false }),
      cursor: t.arg.string({ required: false }),
    },
    resolve: async (_root, { limit, cursor }, ctx) => {
      if (!ctx.userId) {
        throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      const take = limit ?? DEFAULT_PAGE_SIZE;
      // take + 1 per sapere se esiste una pagina successiva senza una count aggiuntiva
      const rows = await prisma.list.findMany({
        where: { userId: ctx.userId },
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        take: take + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });
      const hasMore = rows.length > take;
      const lists = hasMore ? rows.slice(0, take) : rows;
      return {
        lists,
        nextCursor: hasMore ? lists[lists.length - 1].id : null,
      };
    },
  }),
);
