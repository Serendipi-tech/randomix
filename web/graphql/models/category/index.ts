import { builder } from '../../builder';

interface NameTranslations {
  en?: string | null;
}

export const CategoryRef = builder.prismaObject('Category', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    // traduzioni è un JSON libero in schema; qui esposta con forma fissata { en }, come limitations in Membership
    nameEn: t.string({
      nullable: true,
      resolve: (c) => (c.translations as NameTranslations | null)?.en ?? null,
    }),
    icon: t.exposeString('icon'),
    itemsCount: t.relationCount('items'),
    listCategoriesCount: t.relationCount('includedInCategories'),
  }),
});
