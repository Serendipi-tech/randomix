'use client';

import { useAdminDashboardStats } from '@/utils/useAdminDashboardStats';
import { formatCompactNumber } from '@/utils/formatCompactNumber';
import { StatTile } from '@/components/molecules/StatTile';
import { UserGrowthChart } from '@/components/organisms/UserGrowthChart';
import { MembershipPlanChart } from '@/components/organisms/MembershipPlanChart';

export default function DashboardPage() {
  const { stats, loading, error } = useAdminDashboardStats();

  if (error || (!loading && !stats)) {
    return (
      <main className="p-8">
        <p className="text-error">Impossibile caricare le statistiche.</p>
      </main>
    );
  }

  if (!stats) {
    return (
      <main className="p-8">
        <p className="text-disabled">Caricamento…</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold text-text-color">Dashboard admin</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile label="Totale utenti" value={formatCompactNumber(stats.totalUsers)} />
        <StatTile label="Liste per utente" value={stats.avgListsPerUser.toFixed(1)} />
        <StatTile label="Gruppi per utente" value={stats.avgGroupsPerUser.toFixed(1)} />
        <StatTile label="Utenti per gruppo" value={stats.avgUsersPerGroup.toFixed(1)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UserGrowthChart data={stats.usersGrowth} />
        <MembershipPlanChart data={stats.usersByMembershipPlan} />
      </div>
    </main>
  );
}
