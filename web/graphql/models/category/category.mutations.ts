import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import { requireAdmin } from '../../auth';
import './index';

const CategoryInput = builder.inputType('CategoryInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    icon: t.string({ required: true }),
  }),
});

builder.mutationField('adminCreateCategory', (t) =>
  t.prismaField({
    type: 'Category',
    args: { input: t.arg({ type: CategoryInput, required: true }) },
    resolve: async (query, _root, { input }, ctx) => {
      await requireAdmin(ctx);
      return prisma.category.create({
        ...query,
        data: { name: input.name, icon: input.icon },
      });
    },
  }),
);

builder.mutationField('adminUpdateCategory', (t) =>
  t.prismaField({
    type: 'Category',
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: CategoryInput, required: true }),
    },
    resolve: async (query, _root, { id, input }, ctx) => {
      await requireAdmin(ctx);
      return prisma.category.update({
        ...query,
        where: { id: String(id) },
        data: { name: input.name, icon: input.icon },
      });
    },
  }),
);

builder.mutationField('adminDeleteCategory', (t) =>
  t.field({
    type: 'Boolean',
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      await requireAdmin(ctx);
      const categoryId = String(id);

      const [itemsCount, listCategoriesCount] = await Promise.all([
        prisma.user_Item.count({ where: { categoryId } }),
        prisma.listCategory.count({ where: { includedCategories: { some: { id: categoryId } } } }),
      ]);

      if (itemsCount > 0 || listCategoriesCount > 0) {
        throw new GraphQLError(
          `Impossibile eliminare: in uso da ${itemsCount} item e ${listCategoriesCount} macro-categorie.`,
          { extensions: { code: 'CATEGORY_IN_USE', itemsCount, listCategoriesCount } },
        );
      }

      await prisma.category.delete({ where: { id: categoryId } });
      return true;
    },
  }),
);
