'use client';

import { useState } from 'react';
import { useAdminUserDetail } from '@/utils/useAdminUserDetail';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';

interface UserDetailModalProps {
  userId: string;
  onClose: () => void;
}

const PLAN_LABELS: Record<string, string> = {
  FREE: 'Free',
  PREMIUM: 'Premium',
  UNLIMITED: 'Unlimited',
  FREE_TRIAL: 'Free trial',
  FULL_ACCESS: 'Full access',
};

const dateFormatter = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

export function UserDetailModal({ userId, onClose }: UserDetailModalProps) {
  const { user, loading, toggleSuspended, suspending, sendPasswordReset, sendingReset, resetSent } =
    useAdminUserDetail(userId);
  const [confirmingSuspend, setConfirmingSuspend] = useState(false);

  const isSuspended = Boolean(user?.deletedAt);

  const handleToggleSuspend = async () => {
    await toggleSuspended(!isSuspended);
    setConfirmingSuspend(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-foreground p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {loading && <p className="text-sm text-disabled">Caricamento…</p>}

        {user && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text-color">{user.username}</h2>
                <p className="text-sm text-disabled">{user.email}</p>
              </div>
              <button onClick={onClose} className="text-disabled hover:text-text-color" aria-label="Chiudi">
                ✕
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge label={user.role} color="var(--primary)" />
              <Badge label={isSuspended ? 'Sospeso' : 'Attivo'} color={isSuspended ? 'var(--error)' : 'var(--success)'} />
              <Badge label={PLAN_LABELS[user.membershipPlan] ?? user.membershipPlan} color="var(--accent)" />
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-xl bg-background p-3 text-center">
              <div>
                <p className="text-lg font-semibold text-text-color">{user.listsCount}</p>
                <p className="text-xs text-disabled">Liste</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-text-color">{user.groupsCount}</p>
                <p className="text-xs text-disabled">Gruppi</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-text-color">{user.friendsCount}</p>
                <p className="text-xs text-disabled">Amici</p>
              </div>
            </div>

            <p className="text-sm text-disabled">Iscritto il {dateFormatter.format(new Date(user.createdAt))}</p>

            <div className="flex flex-col gap-2 border-t border-border pt-4">
              {confirmingSuspend ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-text-color">
                    {isSuspended ? 'Confermi la riattivazione?' : 'Confermi la sospensione dell’account?'}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant={isSuspended ? 'confirm' : 'destructive'}
                      label="Conferma"
                      loading={suspending}
                      onClick={handleToggleSuspend}
                    />
                    <Button variant="ghost" label="Annulla" onClick={() => setConfirmingSuspend(false)} />
                  </div>
                </div>
              ) : (
                <Button
                  variant={isSuspended ? 'confirm' : 'destructive'}
                  label={isSuspended ? 'Riattiva account' : 'Sospendi account'}
                  onClick={() => setConfirmingSuspend(true)}
                />
              )}

              <Button
                variant="secondary"
                label={resetSent ? 'Email inviata' : 'Invia reset password'}
                loading={sendingReset}
                disabled={resetSent}
                onClick={sendPasswordReset}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
