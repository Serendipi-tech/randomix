import { builder } from '../../builder';

export const RatingRef = builder.prismaObject('Rating', {
  fields: (t) => ({
    id: t.exposeID('id'),
    value: t.exposeInt('value'),
    note: t.exposeString('note', { nullable: true }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});
