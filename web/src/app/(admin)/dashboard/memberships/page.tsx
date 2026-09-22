'use client';

import { useState } from 'react';
import { useMemberships, type Membership } from '@/utils/useMemberships';
import { MEMBERSHIP_PLANS, PLAN_LABELS, BILLING_LABELS, type MembershipPlan } from '@/utils/membershipLabels';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import { MembershipFormModal } from '@/components/organisms/MembershipFormModal';

type ModalState = { membership: Membership | null; plan: MembershipPlan } | null;

export default function MembershipsPage() {
  const { memberships, loading, refetch } = useMemberships();
  const [modalState, setModalState] = useState<ModalState>(null);

  const closeModal = () => {
    setModalState(null);
    refetch();
  };

  return (
    <main className="flex flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold text-text-color">Pacchetti membership</h1>

      {loading && memberships.length === 0 && <p className="text-disabled">Caricamento…</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MEMBERSHIP_PLANS.map((plan) => {
          const membership = memberships.find((m) => m.plan === plan) ?? null;

          if (!membership) {
            return (
              <Card key={plan}>
                <span className="text-sm font-semibold text-text-color">{PLAN_LABELS[plan]}</span>
                <p className="text-xs text-disabled">Nessuna configurazione attiva</p>
                <Button size="sm" variant="secondary" label="Configura piano" onClick={() => setModalState({ membership: null, plan })} />
              </Card>
            );
          }

          return (
            <Card key={plan} onClick={() => setModalState({ membership, plan })}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-color">{PLAN_LABELS[plan]}</span>
                <span className="text-xs text-disabled">{BILLING_LABELS[membership.billing]}</span>
              </div>
              <p className="text-sm text-text-color">
                {membership.price} {membership.currency}
              </p>
              {membership.description && <p className="truncate text-xs text-disabled">{membership.description}</p>}
              <p className="text-xs text-disabled">
                {membership.maxLists ?? '∞'} liste · {membership.maxItemsPerList ?? '∞'} item/lista
              </p>
              <p className="text-xs text-disabled">{membership.activeSubscriptionsCount} abbonati attivi</p>
            </Card>
          );
        })}
      </div>

      {modalState && (
        <MembershipFormModal initial={modalState.membership} defaultPlan={modalState.plan} onClose={closeModal} />
      )}
    </main>
  );
}
