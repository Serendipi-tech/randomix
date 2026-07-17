import { builder } from '../../builder';

export const TagRef = builder.prismaObject('Tag', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    color: t.exposeString('color'),
    // i tag di sistema (userId null) non sono modificabili dall'utente
    isSystem: t.boolean({
      resolve: (tag) => tag.userId == null,
    }),
  }),
});
