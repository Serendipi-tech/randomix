import { builder } from '../../builder';
import { CategoryEnum } from '../../enum';

export const ListCategoryRef = builder.prismaObject('ListCategory', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    icon: t.exposeString('icon'),
    includedCategories: t.field({
      type: [CategoryEnum],
      resolve: (category) => category.includedCategories,
    }),
  }),
});
