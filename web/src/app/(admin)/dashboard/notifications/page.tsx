'use client';

import { useState } from 'react';
import { useActiveUsersCount } from '@/utils/useActiveUsersCount';
import { useBroadcastHistory } from '@/utils/useBroadcastHistory';
import { useBroadcastForm } from '@/utils/useBroadcastForm';
import { Input } from '@/components/molecules/Input';
import { Button } from '@/components/atoms/Button';
import { FormError } from '@/components/molecules/FormError';
import { Card } from '@/components/molecules/Card';

const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export default function NotificationsPage() {
  const { count, loading: countLoading } = useActiveUsersCount();
  const { history, loading: historyLoading, refetch } = useBroadcastHistory();
  const [confirming, setConfirming] = useState(false);

  const { title, setTitle, body, setBody, send, sending, error } = useBroadcastForm({
    onSent: () => {
      setConfirming(false);
      refetch();
    },
  });

  const canSend = title.trim().length > 0;

  return (
    <main className="flex flex-col gap-8 p-8">
      <h1 className="text-2xl font-semibold text-text-color">Notifiche</h1>

      <section className="flex max-w-lg flex-col gap-4 rounded-2xl border border-border bg-foreground p-6">
        <h2 className="text-lg font-semibold text-text-color">Invia broadcast</h2>
        <Input name="title" label="Titolo" value={title} onChangeText={setTitle} required />
        <Input name="body" label="Corpo (opzionale)" value={body} onChangeText={setBody} />

        <p className="text-sm text-disabled">
          {countLoading ? 'Calcolo destinatari…' : `Verrà inviato a ${count} utenti attivi`}
        </p>

        {error && <FormError message={error.message} />}

        {confirming ? (
          <div className="flex gap-2">
            <Button label="Conferma invio" loading={sending} disabled={!canSend} onClick={send} />
            <Button variant="ghost" label="Annulla" onClick={() => setConfirming(false)} />
          </div>
        ) : (
          <Button label="Invia a tutti" disabled={!canSend} onClick={() => setConfirming(true)} />
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text-color">Storico invii</h2>
        {historyLoading && history.length === 0 && <p className="text-disabled">Caricamento…</p>}
        {!historyLoading && history.length === 0 && <p className="text-disabled">Nessun invio ancora.</p>}
        <div className="flex flex-col gap-2">
          {history.map((entry) => (
            <Card key={`${entry.title}-${entry.sentAt}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-sm font-semibold text-text-color">{entry.title}</span>
                <span className="shrink-0 text-xs text-disabled">{dateFormatter.format(new Date(entry.sentAt))}</span>
              </div>
              {entry.body && <p className="text-xs text-disabled">{entry.body}</p>}
              <p className="text-xs text-disabled">{entry.recipientCount} destinatari</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
