import { builder } from '../../builder';

export const ListCategoryRef = builder.prismaObject('ListCategory', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    icon: t.exposeString('icon'),
    includedCategories: t.relation('includedCategories'),
    listsCount: t.relationCount('lists'),
    groupListsCount: t.relationCount('groupLists'),
  }),
});
