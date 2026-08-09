import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import { requireAdmin } from '../../auth';
import { CategoryEnum } from '../../enum';
import './index';

const ListCategoryInput = builder.inputType('ListCategoryInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    description: t.string({ required: false }),
    icon: t.string({ required: true }),
    includedCategories: t.field({ type: [CategoryEnum], required: true }),
  }),
});

builder.mutationField('adminCreateListCategory', (t) =>
  t.prismaField({
    type: 'ListCategory',
    args: { input: t.arg({ type: ListCategoryInput, required: true }) },
    resolve: async (query, _root, { input }, ctx) => {
      await requireAdmin(ctx);
      return prisma.listCategory.create({
        ...query,
        data: {
          name: input.name,
          description: input.description ?? null,
          icon: input.icon,
          includedCategories: input.includedCategories,
        },
      });
    },
  }),
);

builder.mutationField('adminUpdateListCategory', (t) =>
  t.prismaField({
    type: 'ListCategory',
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: ListCategoryInput, required: true }),
    },
    resolve: async (query, _root, { id, input }, ctx) => {
      await requireAdmin(ctx);
      return prisma.listCategory.update({
        ...query,
        where: { id: String(id) },
        data: {
          name: input.name,
          description: input.description ?? null,
          icon: input.icon,
          includedCategories: input.includedCategories,
        },
      });
    },
  }),
);

builder.mutationField('adminDeleteListCategory', (t) =>
  t.field({
    type: 'Boolean',
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      await requireAdmin(ctx);
      const categoryId = String(id);

      const [listsCount, groupListsCount] = await Promise.all([
        prisma.list.count({ where: { categories: { some: { id: categoryId } } } }),
        prisma.groupList.count({ where: { listCategories: { some: { id: categoryId } } } }),
      ]);

      if (listsCount > 0 || groupListsCount > 0) {
        throw new GraphQLError(
          `Impossibile eliminare: in uso da ${listsCount} liste e ${groupListsCount} liste di gruppo.`,
          { extensions: { code: 'CATEGORY_IN_USE', listsCount, groupListsCount } },
        );
      }

      await prisma.listCategory.delete({ where: { id: categoryId } });
      return true;
    },
  }),
);
