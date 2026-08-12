import { builder } from '../../builder';
import { ReportTypeEnum, StatusReportEnum } from '../../enum';

interface AdminReportRowShape {
  id: string;
  title: string;
  reportType: 'BUG' | 'FEEDBACK' | 'REPORT';
  status: 'SENT' | 'IN_PROGRESS' | 'SOLVED' | 'REJECTED';
  senderUsername: string;
  targetLabel: string | null;
  createdAt: Date;
}

interface AdminReportDetailShape extends AdminReportRowShape {
  body: string | null;
  attachedFiles: string[];
}

export const AdminReportRowRef = builder.objectRef<AdminReportRowShape>('AdminReportRow');
AdminReportRowRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    reportType: t.field({ type: ReportTypeEnum, resolve: (r) => r.reportType }),
    status: t.field({ type: StatusReportEnum, resolve: (r) => r.status }),
    senderUsername: t.exposeString('senderUsername'),
    targetLabel: t.exposeString('targetLabel', { nullable: true }),
    createdAt: t.field({ type: 'DateTime', resolve: (r) => r.createdAt }),
  }),
});

interface AdminReportsPayloadShape {
  reports: AdminReportRowShape[];
  nextCursor: string | null;
}

export const AdminReportsPayloadRef = builder.objectRef<AdminReportsPayloadShape>('AdminReportsPayload');
AdminReportsPayloadRef.implement({
  fields: (t) => ({
    reports: t.field({ type: [AdminReportRowRef], resolve: (p) => p.reports }),
    nextCursor: t.exposeString('nextCursor', { nullable: true }),
  }),
});

export const AdminReportDetailRef = builder.objectRef<AdminReportDetailShape>('AdminReportDetail');
AdminReportDetailRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    body: t.exposeString('body', { nullable: true }),
    attachedFiles: t.exposeStringList('attachedFiles'),
    reportType: t.field({ type: ReportTypeEnum, resolve: (r) => r.reportType }),
    status: t.field({ type: StatusReportEnum, resolve: (r) => r.status }),
    senderUsername: t.exposeString('senderUsername'),
    targetLabel: t.exposeString('targetLabel', { nullable: true }),
    createdAt: t.field({ type: 'DateTime', resolve: (r) => r.createdAt }),
  }),
});
