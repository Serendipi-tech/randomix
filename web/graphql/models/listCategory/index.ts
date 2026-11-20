import { builder } from '../../builder';

interface NameTranslations {
  en?: string | null;
}

export const ListCategoryRef = builder.prismaObject('ListCategory', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    // traduzioni è un JSON libero in schema; qui esposta con forma fissata { en }, come limitations in Membership
    nameEn: t.string({
      nullable: true,
      resolve: (c) => (c.translations as NameTranslations | null)?.en ?? null,
    }),
    description: t.exposeString('description', { nullable: true }),
    icon: t.exposeString('icon'),
    includedCategories: t.relation('includedCategories'),
    listsCount: t.relationCount('lists'),
    groupListsCount: t.relationCount('groupLists'),
  }),
});
