import { builder } from '../../builder';

interface CategoryStatShape {
  categoryId: string;
  name: string;
  icon: string;
  itemsCount: number;
  drawCount: number;
}

interface CompletionBreakdownShape {
  notStarted: number;
  inProgress: number;
  completed: number;
}

interface DrawAcceptanceShape {
  accepted: number;
  skipped: number;
}

export interface ProfileStatsShape {
  categoryStats: CategoryStatShape[];
  completionBreakdown: CompletionBreakdownShape;
  drawAcceptance: DrawAcceptanceShape;
}

export const CategoryStatRef = builder.objectRef<CategoryStatShape>('CategoryStat');
CategoryStatRef.implement({
  fields: (t) => ({
    categoryId: t.exposeID('categoryId'),
    name: t.exposeString('name'),
    icon: t.exposeString('icon'),
    itemsCount: t.exposeInt('itemsCount'),
    drawCount: t.exposeInt('drawCount'),
  }),
});

export const CompletionBreakdownRef = builder.objectRef<CompletionBreakdownShape>('CompletionBreakdown');
CompletionBreakdownRef.implement({
  fields: (t) => ({
    notStarted: t.exposeInt('notStarted'),
    inProgress: t.exposeInt('inProgress'),
    completed: t.exposeInt('completed'),
  }),
});

export const DrawAcceptanceRef = builder.objectRef<DrawAcceptanceShape>('DrawAcceptance');
DrawAcceptanceRef.implement({
  fields: (t) => ({
    accepted: t.exposeInt('accepted'),
    skipped: t.exposeInt('skipped'),
  }),
});

export const ProfileStatsRef = builder.objectRef<ProfileStatsShape>('ProfileStats');
ProfileStatsRef.implement({
  fields: (t) => ({
    categoryStats: t.field({ type: [CategoryStatRef], resolve: (s) => s.categoryStats }),
    completionBreakdown: t.field({ type: CompletionBreakdownRef, resolve: (s) => s.completionBreakdown }),
    drawAcceptance: t.field({ type: DrawAcceptanceRef, resolve: (s) => s.drawAcceptance }),
  }),
});
