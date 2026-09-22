'use client';

import { useMutation, useQuery } from '@apollo/client';
import { AdminReportMutations, AdminReportQueries } from '@randomix/graphql-schema';
import type { ReportStatus, ReportType } from './reportLabels';

const { ADMIN_REPORT } = AdminReportQueries;
const { ADMIN_UPDATE_REPORT_STATUS } = AdminReportMutations;

export interface AdminReportDetail {
  id: string;
  title: string;
  body: string | null;
  attachedFiles: string[];
  reportType: ReportType;
  status: ReportStatus;
  senderUsername: string;
  targetLabel: string | null;
  createdAt: string;
}

interface AdminReportQueryResult {
  adminReport: AdminReportDetail | null;
}

export function useAdminReportDetail(reportId: string | null) {
  const { data, loading, error, refetch } = useQuery<AdminReportQueryResult>(ADMIN_REPORT, {
    variables: { id: reportId },
    skip: !reportId,
    fetchPolicy: 'network-only',
  });

  const [updateStatus, { loading: updating }] = useMutation(ADMIN_UPDATE_REPORT_STATUS);

  const changeStatus = async (status: ReportStatus) => {
    if (!reportId) return;
    await updateStatus({ variables: { id: reportId, status } });
    await refetch();
  };

  return { report: data?.adminReport ?? null, loading, error, changeStatus, updating };
}
