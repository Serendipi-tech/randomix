import { GraphQLError } from 'graphql';
import { builder, prisma } from '../../builder';
import { requireAdmin } from '../../auth';
import './index';

// Algoritmo dal commento su model Tag (tag.prisma): se esiste già un tag di sistema con lo stesso
// nome (case-insensitive) i nuovi duplicati vi confluiscono, altrimenti se ne crea uno nuovo col
// colore più frequente tra i personali fusi (sorteggio in parità). Gli item/sfide collegati vengono
// riassegnati al tag di sistema, poi i personali vengono eliminati.
builder.mutationField('adminPromoteTagToSystem', (t) =>
  t.prismaField({
    type: 'Tag',
    args: { name: t.arg.string({ required: true }) },
    resolve: async (query, _root, { name }, ctx) => {
      await requireAdmin(ctx);
      const trimmedName = name.trim();

      const personalMatches = await prisma.tag.findMany({
        where: { userId: { not: null }, name: { equals: trimmedName, mode: 'insensitive' } },
        select: {
          id: true,
          color: true,
          useItems: { select: { id: true } },
          connectedChallenges: { select: { id: true } },
        },
      });

      if (personalMatches.length === 0) {
        throw new GraphQLError('Nessun tag personale trovato con questo nome.', { extensions: { code: 'NOT_FOUND' } });
      }

      let systemTag = await prisma.tag.findFirst({
        where: { userId: null, name: { equals: trimmedName, mode: 'insensitive' } },
      });

      if (!systemTag) {
        const colorCounts = new Map<string, number>();
        personalMatches.forEach((tag) => colorCounts.set(tag.color, (colorCounts.get(tag.color) ?? 0) + 1));
        const maxCount = Math.max(...colorCounts.values());
        const topColors = Array.from(colorCounts.entries())
          .filter(([, count]) => count === maxCount)
          .map(([color]) => color);
        const chosenColor = topColors[Math.floor(Math.random() * topColors.length)];

        systemTag = await prisma.tag.create({
          data: { name: trimmedName, color: chosenColor, userId: null },
        });
      }

      const itemIds = new Set<string>();
      const challengeIds = new Set<string>();
      personalMatches.forEach((tag) => {
        tag.useItems.forEach((item) => itemIds.add(item.id));
        tag.connectedChallenges.forEach((challenge) => challengeIds.add(challenge.id));
      });

      await prisma.tag.update({
        where: { id: systemTag.id },
        data: {
          useItems: { connect: Array.from(itemIds).map((id) => ({ id })) },
          connectedChallenges: { connect: Array.from(challengeIds).map((id) => ({ id })) },
        },
      });

      await prisma.tag.deleteMany({ where: { id: { in: personalMatches.map((tag) => tag.id) } } });

      return prisma.tag.findUniqueOrThrow({ ...query, where: { id: systemTag.id } });
    },
  }),
);

builder.mutationField('adminUpdateSystemTag', (t) =>
  t.prismaField({
    type: 'Tag',
    args: {
      id: t.arg.id({ required: true }),
      name: t.arg.string({ required: false }),
      color: t.arg.string({ required: false }),
    },
    resolve: async (query, _root, { id, name, color }, ctx) => {
      await requireAdmin(ctx);
      const tagId = String(id);

      const tag = await prisma.tag.findUnique({ where: { id: tagId } });
      if (!tag || tag.userId !== null) {
        throw new GraphQLError('Tag di sistema non trovato.', { extensions: { code: 'NOT_FOUND' } });
      }

      const trimmedName = name?.trim();
      if (trimmedName) {
        const collision = await prisma.tag.findFirst({
          where: { userId: null, id: { not: tagId }, name: { equals: trimmedName, mode: 'insensitive' } },
        });
        if (collision) {
          throw new GraphQLError('Esiste già un tag di sistema con questo nome.', { extensions: { code: 'CONFLICT' } });
        }
      }

      return prisma.tag.update({
        ...query,
        where: { id: tagId },
        data: {
          ...(trimmedName ? { name: trimmedName } : {}),
          ...(color ? { color } : {}),
        },
      });
    },
  }),
);

builder.mutationField('adminDeleteSystemTag', (t) =>
  t.field({
    type: 'Boolean',
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      await requireAdmin(ctx);
      const tagId = String(id);

      const tag = await prisma.tag.findUnique({ where: { id: tagId } });
      if (!tag || tag.userId !== null) {
        throw new GraphQLError('Tag di sistema non trovato.', { extensions: { code: 'NOT_FOUND' } });
      }

      await prisma.tag.delete({ where: { id: tagId } });
      return true;
    },
  }),
);
