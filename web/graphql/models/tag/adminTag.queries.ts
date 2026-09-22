import { builder, prisma } from '../../builder';
import { requireAdmin } from '../../auth';
import './index';

interface TagColorCountShape {
  color: string;
  count: number;
}

interface AdminTagGroupShape {
  name: string;
  personalCount: number;
  distinctUsersCount: number;
  totalItemsCount: number;
  colors: TagColorCountShape[];
  existingSystemTagId: string | null;
}

const TagColorCountRef = builder.objectRef<TagColorCountShape>('TagColorCount');
TagColorCountRef.implement({
  fields: (t) => ({
    color: t.exposeString('color'),
    count: t.exposeInt('count'),
  }),
});

const AdminTagGroupRef = builder.objectRef<AdminTagGroupShape>('AdminTagGroup');
AdminTagGroupRef.implement({
  fields: (t) => ({
    name: t.exposeString('name'),
    personalCount: t.exposeInt('personalCount'),
    distinctUsersCount: t.exposeInt('distinctUsersCount'),
    totalItemsCount: t.exposeInt('totalItemsCount'),
    colors: t.field({ type: [TagColorCountRef], resolve: (g) => g.colors }),
    existingSystemTagId: t.exposeID('existingSystemTagId', { nullable: true }),
  }),
});

interface TagGroupAccumulator {
  nameFrequency: Map<string, number>;
  userIds: Set<string>;
  personalCount: number;
  itemsCount: number;
  colorFrequency: Map<string, number>;
}

builder.queryField('adminTagGroups', (t) =>
  t.field({
    type: [AdminTagGroupRef],
    resolve: async (_root, _args, ctx) => {
      await requireAdmin(ctx);

      // Aggregazione case-insensitive lato applicazione: Prisma non supporta groupBy su
      // un'espressione (LOWER(name)), solo su colonne dirette.
      const [personalTags, systemTags] = await Promise.all([
        prisma.tag.findMany({
          where: { userId: { not: null } },
          select: { name: true, color: true, userId: true, _count: { select: { useItems: true } } },
        }),
        prisma.tag.findMany({ where: { userId: null }, select: { id: true, name: true } }),
      ]);

      const systemTagIdByLowerName = new Map(systemTags.map((tag) => [tag.name.trim().toLowerCase(), tag.id]));

      const groups = new Map<string, TagGroupAccumulator>();
      for (const tag of personalTags) {
        const key = tag.name.trim().toLowerCase();
        if (!groups.has(key)) {
          groups.set(key, { nameFrequency: new Map(), userIds: new Set(), personalCount: 0, itemsCount: 0, colorFrequency: new Map() });
        }
        const group = groups.get(key)!;
        group.nameFrequency.set(tag.name, (group.nameFrequency.get(tag.name) ?? 0) + 1);
        group.userIds.add(tag.userId!);
        group.personalCount += 1;
        group.itemsCount += tag._count.useItems;
        group.colorFrequency.set(tag.color, (group.colorFrequency.get(tag.color) ?? 0) + 1);
      }

      return Array.from(groups.entries())
        .map(([key, group]) => {
          // capitalizzazione più frequente tra i personali (mostrata come nome del gruppo)
          const mostFrequentName = Array.from(group.nameFrequency.entries()).sort((a, b) => b[1] - a[1])[0][0];
          return {
            name: mostFrequentName,
            personalCount: group.personalCount,
            distinctUsersCount: group.userIds.size,
            totalItemsCount: group.itemsCount,
            colors: Array.from(group.colorFrequency.entries()).map(([color, count]) => ({ color, count })),
            existingSystemTagId: systemTagIdByLowerName.get(key) ?? null,
          };
        })
        .sort((a, b) => b.personalCount - a.personalCount || a.name.localeCompare(b.name));
    },
  }),
);

builder.queryField('adminSystemTags', (t) =>
  t.prismaField({
    type: ['Tag'],
    resolve: async (query, _root, _args, ctx) => {
      await requireAdmin(ctx);
      return prisma.tag.findMany({ ...query, where: { userId: null }, orderBy: { name: 'asc' } });
    },
  }),
);
