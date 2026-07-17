import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import './index';

const CreateListInput = builder.inputType('CreateListInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    icon: t.string({ required: true }),
    color: t.string({ required: true }),
    description: t.string({ required: false }),
    isHidden: t.boolean({ required: false }),
    categoryIds: t.idList({ required: false }),
  }),
});

const UpdateListInput = builder.inputType('UpdateListInput', {
  fields: (t) => ({
    name: t.string({ required: false }),
    icon: t.string({ required: false }),
    color: t.string({ required: false }),
    description: t.string({ required: false }),
    isHidden: t.boolean({ required: false }),
    categoryIds: t.idList({ required: false }),
  }),
});

function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

// la lista deve esistere ed essere dell'utente, altrimenti NOT_FOUND
async function requireOwnedList(listId: string, userId: string) {
  const list = await prisma.list.findFirst({ where: { id: listId, userId } });
  if (!list) {
    throw new GraphQLError('Lista non trovata.', { extensions: { code: 'NOT_FOUND' } });
  }
  return list;
}

builder.mutationField('createList', (t) =>
  t.prismaField({
    type: 'List',
    args: { input: t.arg({ type: CreateListInput, required: true }) },
    resolve: async (query, _root, { input }, ctx) => {
      requireAuth(ctx.userId);
      return prisma.list.create({
        ...query,
        data: {
          name: input.name.trim(),
          icon: input.icon,
          color: input.color,
          description: input.description ?? null,
          isHidden: input.isHidden ?? false,
          userId: ctx.userId,
          ...(input.categoryIds?.length && {
            categories: { connect: input.categoryIds.map((id) => ({ id: String(id) })) },
          }),
        },
      });
    },
  }),
);

builder.mutationField('updateList', (t) =>
  t.prismaField({
    type: 'List',
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdateListInput, required: true }),
    },
    resolve: async (query, _root, { id, input }, ctx) => {
      requireAuth(ctx.userId);
      await requireOwnedList(String(id), ctx.userId);
      return prisma.list.update({
        ...query,
        where: { id: String(id) },
        data: {
          ...(input.name != null && { name: input.name.trim() }),
          ...(input.icon != null && { icon: input.icon }),
          ...(input.color != null && { color: input.color }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.isHidden != null && { isHidden: input.isHidden }),
          ...(input.categoryIds && {
            categories: { set: input.categoryIds.map((catId) => ({ id: String(catId) })) },
          }),
        },
      });
    },
  }),
);

builder.mutationField('deleteList', (t) =>
  t.boolean({
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      requireAuth(ctx.userId);
      await requireOwnedList(String(id), ctx.userId);
      await prisma.list.delete({ where: { id: String(id) } });
      return true;
    },
  }),
);
