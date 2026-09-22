interface MembershipPlanCount {
  plan: string;
  count: number;
}

interface MembershipPlanChartProps {
  data: MembershipPlanCount[];
}

const PLAN_LABELS: Record<string, string> = {
  FREE: 'Free',
  PREMIUM: 'Premium',
  UNLIMITED: 'Unlimited',
  FREE_TRIAL: 'Free trial',
  FULL_ACCESS: 'Full access',
};

// Confronto di magnitudo tra categorie: un solo hue (--accent) basta, l'identità la porta già
// la posizione/etichetta della riga — niente palette categorica multi-colore da validare.
export function MembershipPlanChart({ data }: MembershipPlanChartProps) {
  const sorted = [...data].sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...sorted.map((d) => d.count), 1);

  return (
    <div className="rounded-2xl border border-border bg-foreground p-5">
      <p className="mb-4 text-sm text-disabled">Utenti per piano membership</p>
      <div className="flex flex-col gap-3">
        {sorted.map((row) => (
          <div key={row.plan} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-sm text-text-color">{PLAN_LABELS[row.plan] ?? row.plan}</span>
            <div className="h-6 flex-1 overflow-hidden rounded-sm bg-background">
              <div
                className="h-full rounded-r-[4px] bg-accent"
                style={{ width: `${(row.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="w-8 shrink-0 text-right text-sm font-semibold text-text-color">{row.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
