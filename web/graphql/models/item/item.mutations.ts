import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import { StatusCompletionEnum } from '../../enum';
import { getActiveMembership } from '../membership/limitations';
import './index';

const AddItemToListInput = builder.inputType('AddItemToListInput', {
  fields: (t) => ({
    listId: t.id({ required: true }),
    name: t.string({ required: true }),
    categoryId: t.id({ required: true }),
    description: t.string({ required: false }),
    note: t.string({ required: false }),
  }),
});

const UpdateUserItemInput = builder.inputType('UpdateUserItemInput', {
  fields: (t) => ({
    name: t.string({ required: false }),
    categoryId: t.id({ required: false }),
    description: t.string({ required: false }),
    note: t.string({ required: false }),
    status: t.field({ type: StatusCompletionEnum, required: false }),
    isHidden: t.boolean({ required: false }),
    tagIds: t.idList({ required: false }),
  }),
});

function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

// verifica il limite maxItemsPerList del piano attivo, solo se l'item non è già in lista
// (altrimenti l'upsert è un no-op e non aumenta il conteggio)
async function checkMaxItemsPerListLimit(userId: string, listId: string, userItemId: string | null) {
  const alreadyInList = userItemId
    ? await prisma.list_UserItem.findUnique({
        where: { listId_userItemId: { listId, userItemId } },
      })
    : null;
  if (alreadyInList) return;

  const limitations = await getActiveMembership(userId);
  if (limitations?.maxItemsPerList == null) return;

  const itemsCount = await prisma.list_UserItem.count({ where: { listId } });
  if (itemsCount >= limitations.maxItemsPerList) {
    throw new GraphQLError('Hai raggiunto il numero massimo di elementi consentiti dal tuo piano per questa lista.', {
      extensions: { code: 'LIMIT_REACHED' },
    });
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

      const categoryId = String(input.categoryId);
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category) {
        throw new GraphQLError('Categoria non trovata.', { extensions: { code: 'NOT_FOUND' } });
      }

      // riuso il record personale dell'utente se l'item (stesso nome+categoria) è già nella sua collezione
      const existingUserItem = await prisma.user_Item.findUnique({
        where: {
          userId_name_categoryId: { userId: ctx.userId, name: input.name.trim(), categoryId },
        },
      });
      await checkMaxItemsPerListLimit(ctx.userId, listId, existingUserItem?.id ?? null);

      const userItem = await prisma.user_Item.upsert({
        where: {
          userId_name_categoryId: { userId: ctx.userId, name: input.name.trim(), categoryId },
        },
        create: {
          userId: ctx.userId,
          name: input.name.trim(),
          categoryId,
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

// verifica che il piano attivo consenta di nascondere gli item agli amici
async function checkHideItemsEnabled(userId: string) {
  const limitations = await getActiveMembership(userId);
  if (!limitations?.hideItemsEnabled) {
    throw new GraphQLError('Il tuo piano non consente di nascondere gli elementi agli amici.', {
      extensions: { code: 'LIMIT_REACHED' },
    });
  }
}

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

      // name/categoryId non sono nullable su User_Item: un null esplicito dal client è trattato come "nessuna modifica"
      const nextName = input.name != null ? input.name.trim() : userItem.name;
      const nextCategoryId = input.categoryId != null ? String(input.categoryId) : userItem.categoryId;

      if (input.categoryId != null) {
        const category = await prisma.category.findUnique({ where: { id: nextCategoryId } });
        if (!category) {
          throw new GraphQLError('Categoria non trovata.', { extensions: { code: 'NOT_FOUND' } });
        }
      }

      // nome+categoria sono univoci per utente (vedi @@unique in item.prisma): evito la violazione di vincolo
      if (nextName !== userItem.name || nextCategoryId !== userItem.categoryId) {
        const duplicate = await prisma.user_Item.findFirst({
          where: { userId: ctx.userId, name: nextName, categoryId: nextCategoryId, NOT: { id: userItem.id } },
        });
        if (duplicate) {
          throw new GraphQLError('Hai già un elemento con questo nome in questa categoria.', {
            extensions: { code: 'CONFLICT' },
          });
        }
      }

      if (input.isHidden === true) {
        await checkHideItemsEnabled(ctx.userId);
      }

      // accetto solo tag dell'utente o di sistema
      let validTagIds: string[] | null = null;
      if (input.tagIds) {
        const tags = await prisma.tag.findMany({
          where: {
            id: { in: input.tagIds.map(String) },
            OR: [{ userId: ctx.userId }, { userId: null }],
          },
          select: { id: true },
        });
        validTagIds = tags.map((tag) => tag.id);
      }
      return prisma.user_Item.update({
        ...query,
        where: { id: String(id) },
        data: {
          ...(input.name != null && { name: nextName }),
          ...(input.categoryId != null && { categoryId: nextCategoryId }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.note !== undefined && { note: input.note }),
          ...(input.status != null && { status: input.status }),
          ...(input.isHidden != null && { isHidden: input.isHidden }),
          ...(validTagIds && { tags: { set: validTagIds.map((tagId) => ({ id: tagId })) } }),
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
