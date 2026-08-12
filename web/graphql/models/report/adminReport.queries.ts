import { builder, prisma } from '../../builder';
import { requireAdmin } from '../../auth';
import { ReportTypeEnum, StatusReportEnum } from '../../enum';
import { AdminReportDetailRef, AdminReportsPayloadRef } from './index';
import './index';

const DEFAULT_PAGE_SIZE = 20;

interface ReportForResolution {
  reportedId: string | null;
  itemId: string | null;
  groupId: string | null;
  challengeId: string | null;
}

// Il target è polimorfico (uno solo dei quattro campi è valorizzato): risolve il nome/username
// leggibile dell'entità segnalata, invece di esporre solo l'id grezzo.
async function resolveTargetLabel(report: ReportForResolution): Promise<string | null> {
  if (report.reportedId) {
    const user = await prisma.user.findUnique({ where: { id: report.reportedId }, select: { username: true } });
    return user ? `Utente: ${user.username}` : null;
  }
  if (report.itemId) {
    const item = await prisma.item.findUnique({ where: { id: report.itemId }, select: { name: true } });
    return item ? `Item: ${item.name}` : null;
  }
  if (report.groupId) {
    const group = await prisma.group.findUnique({ where: { id: report.groupId }, select: { name: true } });
    return group ? `Gruppo: ${group.name}` : null;
  }
  if (report.challengeId) {
    const challenge = await prisma.groupChallenge.findUnique({ where: { id: report.challengeId }, select: { name: true } });
    return challenge ? `Sfida: ${challenge.name}` : null;
  }
  return null;
}

builder.queryField('adminReports', (t) =>
  t.field({
    type: AdminReportsPayloadRef,
    args: {
      status: t.arg({ type: StatusReportEnum, required: false }),
      reportType: t.arg({ type: ReportTypeEnum, required: false }),
      limit: t.arg.int({ required: false }),
      cursor: t.arg.string({ required: false }),
    },
    resolve: async (_root, { status, reportType, limit, cursor }, ctx) => {
      await requireAdmin(ctx);

      const take = limit ?? DEFAULT_PAGE_SIZE;
      const where = {
        ...(status ? { status } : {}),
        ...(reportType ? { reportType } : {}),
      };

      const rows = await prisma.report.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: take + 1,
        include: { sender: { select: { username: true } } },
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });

      const hasMore = rows.length > take;
      const page = hasMore ? rows.slice(0, take) : rows;

      const reports = await Promise.all(
        page.map(async (report) => ({
          id: report.id,
          title: report.title,
          reportType: report.reportType,
          status: report.status,
          senderUsername: report.sender.username,
          targetLabel: await resolveTargetLabel(report),
          createdAt: report.createdAt,
        })),
      );

      return { reports, nextCursor: hasMore ? page[page.length - 1].id : null };
    },
  }),
);

builder.queryField('adminReport', (t) =>
  t.field({
    type: AdminReportDetailRef,
    nullable: true,
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      await requireAdmin(ctx);

      const report = await prisma.report.findUnique({
        where: { id: String(id) },
        include: { sender: { select: { username: true } } },
      });
      if (!report) return null;

      return {
        id: report.id,
        title: report.title,
        body: report.body,
        attachedFiles: report.attachedFiles,
        reportType: report.reportType,
        status: report.status,
        senderUsername: report.sender.username,
        targetLabel: await resolveTargetLabel(report),
        createdAt: report.createdAt,
      };
    },
  }),
);
