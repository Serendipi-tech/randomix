'use client';

import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { AdminReportQueries } from '@randomix/graphql-schema';
import type { ReportStatus, ReportType } from './reportLabels';

const { ADMIN_REPORTS } = AdminReportQueries;

const PAGE_SIZE = 20;

export interface AdminReportRow {
  id: string;
  title: string;
  reportType: ReportType;
  status: ReportStatus;
  senderUsername: string;
  targetLabel: string | null;
  createdAt: string;
}

interface AdminReportsQueryResult {
  adminReports: { reports: AdminReportRow[]; nextCursor: string | null };
}

// Filtri stato/tipo + paginazione cursor "carica altri", stesso pattern di useAdminUsers.
export function useAdminReports() {
  const [status, setStatus] = useState<ReportStatus | ''>('');
  const [reportType, setReportType] = useState<ReportType | ''>('');
  const [reports, setReports] = useState<AdminReportRow[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [runQuery, { loading, error }] = useLazyQuery<AdminReportsQueryResult>(ADMIN_REPORTS, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    runQuery({
      variables: { status: status || undefined, reportType: reportType || undefined, limit: PAGE_SIZE },
    }).then((res) => {
      setReports(res.data?.adminReports.reports ?? []);
      setNextCursor(res.data?.adminReports.nextCursor ?? null);
    });
  }, [status, reportType, runQuery]);

  const loadMore = async () => {
    if (!nextCursor) return;
    const res = await runQuery({
      variables: { status: status || undefined, reportType: reportType || undefined, limit: PAGE_SIZE, cursor: nextCursor },
    });
    setReports((prev) => [...prev, ...(res.data?.adminReports.reports ?? [])]);
    setNextCursor(res.data?.adminReports.nextCursor ?? null);
  };

  const refresh = () => {
    runQuery({ variables: { status: status || undefined, reportType: reportType || undefined, limit: PAGE_SIZE } }).then((res) => {
      setReports(res.data?.adminReports.reports ?? []);
      setNextCursor(res.data?.adminReports.nextCursor ?? null);
    });
  };

  return { status, setStatus, reportType, setReportType, reports, nextCursor, loadMore, refresh, loading, error };
}
