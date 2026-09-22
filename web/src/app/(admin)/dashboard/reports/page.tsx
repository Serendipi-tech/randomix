'use client';

import { useState } from 'react';
import { useAdminReports, type AdminReportRow } from '@/utils/useAdminReports';
import { REPORT_STATUSES, REPORT_TYPES, STATUS_LABELS, STATUS_COLORS, TYPE_LABELS, type ReportStatus, type ReportType } from '@/utils/reportLabels';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Table, type TableColumn } from '@/components/organisms/Table';
import { ReportDetailModal } from '@/components/organisms/ReportDetailModal';

const dateFormatter = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });

export default function ReportsPage() {
  const { status, setStatus, reportType, setReportType, reports, nextCursor, loadMore, refresh, loading } = useAdminReports();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const closeModal = () => {
    setSelectedReportId(null);
    refresh();
  };

  const columns: TableColumn<AdminReportRow>[] = [
    { key: 'title', header: 'Titolo', render: (row) => row.title },
    { key: 'sender', header: 'Mittente', render: (row) => row.senderUsername },
    { key: 'type', header: 'Tipo', render: (row) => <Badge label={TYPE_LABELS[row.reportType]} color="var(--primary)" /> },
    {
      key: 'status',
      header: 'Stato',
      render: (row) => <Badge label={STATUS_LABELS[row.status]} color={STATUS_COLORS[row.status]} />,
    },
    { key: 'createdAt', header: 'Data', render: (row) => dateFormatter.format(new Date(row.createdAt)) },
  ];

  return (
    <main className="flex flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold text-text-color">Segnalazioni</h1>

      <div className="flex gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ReportStatus | '')}
          className="rounded-[10px] border-[1.5px] border-border bg-foreground px-3.5 py-2.5 text-sm text-text-color"
        >
          <option value="">Tutti gli stati</option>
          {REPORT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value as ReportType | '')}
          className="rounded-[10px] border-[1.5px] border-border bg-foreground px-3.5 py-2.5 text-sm text-text-color"
        >
          <option value="">Tutti i tipi</option>
          {REPORT_TYPES.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-border bg-foreground p-4">
        <Table
          columns={columns}
          rows={reports}
          rowKey={(row) => row.id}
          onRowClick={(row) => setSelectedReportId(row.id)}
          emptyMessage={loading ? 'Caricamento…' : 'Nessuna segnalazione trovata'}
        />
      </div>

      {nextCursor && <Button variant="ghost" label="Carica altri" loading={loading} onClick={loadMore} />}

      {selectedReportId && <ReportDetailModal reportId={selectedReportId} onClose={closeModal} />}
    </main>
  );
}
