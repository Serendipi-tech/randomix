'use client';

import { useAdminReportDetail } from '@/utils/useAdminReportDetail';
import { REPORT_STATUSES, STATUS_LABELS, STATUS_COLORS, TYPE_LABELS, type ReportStatus } from '@/utils/reportLabels';
import { Badge } from '@/components/atoms/Badge';

interface ReportDetailModalProps {
  reportId: string;
  onClose: () => void;
}

const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function ReportDetailModal({ reportId, onClose }: ReportDetailModalProps) {
  const { report, loading, changeStatus, updating } = useAdminReportDetail(reportId);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-2xl border border-border bg-foreground p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {loading && <p className="text-sm text-disabled">Caricamento…</p>}

        {report && (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text-color">{report.title}</h2>
                <p className="text-sm text-disabled">da {report.senderUsername}</p>
              </div>
              <button onClick={onClose} className="text-disabled hover:text-text-color" aria-label="Chiudi">
                ✕
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge label={TYPE_LABELS[report.reportType]} color="var(--primary)" />
              <Badge label={STATUS_LABELS[report.status]} color={STATUS_COLORS[report.status]} />
            </div>

            {report.targetLabel && <p className="text-sm text-text-color">Target: {report.targetLabel}</p>}
            {report.body && <p className="text-sm text-text-color">{report.body}</p>}

            {report.attachedFiles.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-disabled">Allegati</span>
                {report.attachedFiles.map((url) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-sm text-primary hover:underline"
                  >
                    {url}
                  </a>
                ))}
              </div>
            )}

            <p className="text-xs text-disabled">Inviata il {dateFormatter.format(new Date(report.createdAt))}</p>

            <div className="flex flex-col gap-1.5 border-t border-border pt-4">
              <span className="text-sm font-semibold text-text-color">Stato</span>
              <select
                value={report.status}
                disabled={updating}
                onChange={(e) => changeStatus(e.target.value as ReportStatus)}
                className="w-full rounded-[10px] border-[1.5px] border-border bg-foreground px-3.5 py-3 text-sm text-text-color"
              >
                {REPORT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
