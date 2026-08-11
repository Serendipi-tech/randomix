'use client';

import { usePaymentStats, PAYMENT_STATS_PERIODS } from '@/utils/usePaymentStats';
import { StatTile } from '@/components/molecules/StatTile';
import { Chip } from '@/components/atoms/Chip';
import { RevenueChart } from '@/components/organisms/RevenueChart';

const currencyFormatter = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });

const STATUS_LABELS: Record<string, string> = {
  SUCCESS: 'Riusciti',
  PENDING: 'In sospeso',
  FAILED: 'Falliti',
};

export default function PaymentsPage() {
  const { days, setDays, stats, loading, error } = usePaymentStats();

  const successCount = stats?.paymentsByStatus.find((s) => s.status === 'SUCCESS')?.count ?? 0;
  const failedCount = stats?.paymentsByStatus.find((s) => s.status === 'FAILED')?.count ?? 0;

  return (
    <main className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-color">Pagamenti</h1>
        <div className="flex gap-2">
          {PAYMENT_STATS_PERIODS.map((period) => (
            <Chip key={period} label={`${period}g`} selected={days === period} onClick={() => setDays(period)} />
          ))}
        </div>
      </div>

      {error && <p className="text-error">Impossibile caricare le statistiche.</p>}
      {loading && !stats && <p className="text-disabled">Caricamento…</p>}

      {stats && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <StatTile label="Entrate totali" value={currencyFormatter.format(stats.totalRevenue)} />
            <StatTile label="Pagamenti riusciti" value={String(successCount)} />
            <StatTile label="Pagamenti falliti" value={String(failedCount)} />
          </div>

          {stats.paymentsByStatus.length > 0 && (
            <div className="flex flex-wrap gap-2 text-sm text-disabled">
              {stats.paymentsByStatus.map((s) => (
                <span key={s.status}>
                  {STATUS_LABELS[s.status] ?? s.status}: {s.count}
                </span>
              ))}
            </div>
          )}

          <RevenueChart data={stats.revenueByDay} title={`Entrate/giorno (ultimi ${days} giorni)`} />
        </>
      )}
    </main>
  );
}
