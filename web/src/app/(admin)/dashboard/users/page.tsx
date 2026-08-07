'use client';

import { useState } from 'react';
import { useAdminUsers, type AdminUserRow } from '@/utils/useAdminUsers';
import { Input } from '@/components/molecules/Input';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Table, type TableColumn } from '@/components/organisms/Table';
import { UserDetailModal } from '@/components/organisms/UserDetailModal';

const dateFormatter = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });

export default function UsersPage() {
  const { search, setSearch, users, nextCursor, loadMore, loading } = useAdminUsers();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const columns: TableColumn<AdminUserRow>[] = [
    { key: 'username', header: 'Utente', render: (row) => row.username },
    { key: 'email', header: 'Email', render: (row) => row.email },
    { key: 'role', header: 'Ruolo', render: (row) => <Badge label={row.role} color="var(--primary)" /> },
    {
      key: 'status',
      header: 'Stato',
      render: (row) => (
        <Badge label={row.deletedAt ? 'Sospeso' : 'Attivo'} color={row.deletedAt ? 'var(--error)' : 'var(--success)'} />
      ),
    },
    { key: 'createdAt', header: 'Iscritto il', render: (row) => dateFormatter.format(new Date(row.createdAt)) },
  ];

  return (
    <main className="flex flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold text-text-color">Utenti</h1>

      <Input
        name="search"
        placeholder="Cerca per username o email…"
        value={search}
        onChangeText={setSearch}
      />

      <div className="rounded-2xl border border-border bg-foreground p-4">
        <Table
          columns={columns}
          rows={users}
          rowKey={(row) => row.id}
          onRowClick={(row) => setSelectedUserId(row.id)}
          emptyMessage={loading ? 'Caricamento…' : 'Nessun utente trovato'}
        />
      </div>

      {nextCursor && (
        <Button variant="ghost" label="Carica altri" loading={loading} onClick={loadMore} />
      )}

      {selectedUserId && <UserDetailModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />}
    </main>
  );
}
