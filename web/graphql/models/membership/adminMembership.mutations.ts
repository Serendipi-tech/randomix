import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import { requireAdmin } from '../../auth';
import { MembershipPlanEnum, BillingEnum } from '../../enum';
import './index';

const MembershipInput = builder.inputType('MembershipInput', {
  fields: (t) => ({
    plan: t.field({ type: MembershipPlanEnum, required: true }),
    description: t.string({ required: false }),
    price: t.float({ required: true }),
    currency: t.string({ required: false }),
    billing: t.field({ type: BillingEnum, required: true }),
    maxLists: t.int({ required: false }),
    maxItemsPerList: t.int({ required: false }),
  }),
});

function buildLimitations(maxLists?: number | null, maxItemsPerList?: number | null) {
  if (maxLists == null && maxItemsPerList == null) return undefined;
  return { maxLists: maxLists ?? null, maxItemsPerList: maxItemsPerList ?? null };
}

// Ogni "modifica" crea una nuova versione (nuova riga) e soft-elimina quella precedente: gli
// abbonati già attivi restano legati a prezzo/limiti che avevano al momento della sottoscrizione
// (subscription.membershipId non cambia da solo), le nuove sottoscrizioni prendono la versione
// attiva più recente per quel piano.
builder.mutationField('adminCreateMembership', (t) =>
  t.prismaField({
    type: 'Membership',
    args: { input: t.arg({ type: MembershipInput, required: true }) },
    resolve: async (query, _root, { input }, ctx) => {
      await requireAdmin(ctx);

      const existing = await prisma.membership.findFirst({ where: { plan: input.plan, deletedAt: null } });
      if (existing) {
        throw new GraphQLError('Esiste già una versione attiva per questo piano: usa la modifica.', {
          extensions: { code: 'CONFLICT' },
        });
      }

      return prisma.membership.create({
        ...query,
        data: {
          plan: input.plan,
          description: input.description ?? null,
          price: input.price,
          currency: input.currency ?? 'EUR',
          billing: input.billing,
          limitations: buildLimitations(input.maxLists, input.maxItemsPerList),
        },
      });
    },
  }),
);

builder.mutationField('adminUpdateMembership', (t) =>
  t.prismaField({
    type: 'Membership',
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: MembershipInput, required: true }),
    },
    resolve: async (query, _root, { id, input }, ctx) => {
      await requireAdmin(ctx);
      const currentId = String(id);

      const current = await prisma.membership.findUnique({ where: { id: currentId } });
      if (!current || current.deletedAt) {
        throw new GraphQLError('Versione del piano non trovata.', { extensions: { code: 'NOT_FOUND' } });
      }
      if (input.plan !== current.plan) {
        throw new GraphQLError('Non puoi cambiare il piano di una versione esistente: crea una nuova configurazione.', {
          extensions: { code: 'BAD_REQUEST' },
        });
      }

      const [, created] = await prisma.$transaction([
        prisma.membership.update({ where: { id: currentId }, data: { deletedAt: new Date() } }),
        prisma.membership.create({
          data: {
            plan: input.plan,
            description: input.description ?? null,
            price: input.price,
            currency: input.currency ?? 'EUR',
            billing: input.billing,
            limitations: buildLimitations(input.maxLists, input.maxItemsPerList),
          },
        }),
      ]);

      return prisma.membership.findUniqueOrThrow({ ...query, where: { id: created.id } });
    },
  }),
);

builder.mutationField('adminDeleteMembership', (t) =>
  t.field({
    type: 'Boolean',
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      await requireAdmin(ctx);
      await prisma.membership.update({ where: { id: String(id) }, data: { deletedAt: new Date() } });
      return true;
    },
  }),
);
