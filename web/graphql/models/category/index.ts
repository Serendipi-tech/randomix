import { builder } from '../../builder';

export const CategoryRef = builder.prismaObject('Category', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    icon: t.exposeString('icon'),
    itemsCount: t.relationCount('items'),
    listCategoriesCount: t.relationCount('includedInCategories'),
  }),
});
