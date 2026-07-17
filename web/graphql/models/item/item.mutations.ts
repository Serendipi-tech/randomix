import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import { CategoryEnum, StatusCompletionEnum } from '../../enum';
import './index';

const AddItemToListInput = builder.inputType('AddItemToListInput', {
  fields: (t) => ({
    listId: t.id({ required: true }),
    name: t.string({ required: true }),
    category: t.field({ type: CategoryEnum, required: true }),
    description: t.string({ required: false }),
    note: t.string({ required: false }),
  }),
});

const UpdateUserItemInput = builder.inputType('UpdateUserItemInput', {
  fields: (t) => ({
    description: t.string({ required: false }),
    note: t.string({ required: false }),
    status: t.field({ type: StatusCompletionEnum, required: false }),
    isHidden: t.boolean({ required: false }),
  }),
});

function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

builder.mutationField('addItemToList', (t) =>
  t.prismaField({
    type: 'List_UserItem',
    args: { input: t.arg({ type: AddItemToListInput, required: true }) },
    resolve: async (query, _root, { input }, ctx) => {
      requireAuth(ctx.userId);
      const listId = String(input.listId);
      const list = await prisma.list.findFirst({ where: { id: listId, userId: ctx.userId } });
      if (!list) {
        throw new GraphQLError('Lista non trovata.', { extensions: { code: 'NOT_FOUND' } });
      }

      // riuso l'Item globale se esiste già (unique su name+category)
      const item = await prisma.item.upsert({
        where: { name_category: { name: input.name.trim(), category: input.category } },
        create: { name: input.name.trim(), category: input.category },
        update: {},
      });

      // riuso il record personale dell'utente se l'item è già nella sua collezione
      const userItem = await prisma.user_Item.upsert({
        where: { userId_itemId: { userId: ctx.userId, itemId: item.id } },
        create: {
          userId: ctx.userId,
          itemId: item.id,
          description: input.description ?? null,
          note: input.note ?? null,
        },
        update: {},
      });

      return prisma.list_UserItem.upsert({
        ...query,
        where: { listId_userItemId: { listId, userItemId: userItem.id } },
        create: { listId, userItemId: userItem.id },
        update: {},
      });
    },
  }),
);

builder.mutationField('updateUserItem', (t) =>
  t.prismaField({
    type: 'User_Item',
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdateUserItemInput, required: true }),
    },
    resolve: async (query, _root, { id, input }, ctx) => {
      requireAuth(ctx.userId);
      const userItem = await prisma.user_Item.findFirst({
        where: { id: String(id), userId: ctx.userId },
      });
      if (!userItem) {
        throw new GraphQLError('Elemento non trovato.', { extensions: { code: 'NOT_FOUND' } });
      }
      return prisma.user_Item.update({
        ...query,
        where: { id: String(id) },
        data: {
          ...(input.description !== undefined && { description: input.description }),
          ...(input.note !== undefined && { note: input.note }),
          ...(input.status != null && { status: input.status }),
          ...(input.isHidden != null && { isHidden: input.isHidden }),
        },
      });
    },
  }),
);

builder.mutationField('removeItemFromList', (t) =>
  t.boolean({
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      requireAuth(ctx.userId);
      // il join deve appartenere a una lista dell'utente
      const join = await prisma.list_UserItem.findFirst({
        where: { id: String(id), list: { userId: ctx.userId } },
      });
      if (!join) {
        throw new GraphQLError('Elemento non trovato.', { extensions: { code: 'NOT_FOUND' } });
      }
      await prisma.list_UserItem.delete({ where: { id: String(id) } });
      return true;
    },
  }),
);
