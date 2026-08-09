'use client';

import { useState } from 'react';
import { useMembershipForm } from '@/utils/useMembershipForm';
import type { Membership } from '@/utils/useMemberships';
import { PLAN_LABELS, BILLING_OPTIONS, BILLING_LABELS, type MembershipPlan } from '@/utils/membershipLabels';
import { Input } from '@/components/molecules/Input';
import { Button } from '@/components/atoms/Button';
import { FormError } from '@/components/molecules/FormError';

interface MembershipFormModalProps {
  initial: Membership | null;
  defaultPlan?: MembershipPlan;
  onClose: () => void;
}

export function MembershipFormModal({ initial, defaultPlan, onClose }: MembershipFormModalProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const {
    plan,
    description,
    setDescription,
    price,
    setPrice,
    currency,
    setCurrency,
    billing,
    setBilling,
    maxLists,
    setMaxLists,
    maxItemsPerList,
    setMaxItemsPerList,
    save,
    saving,
    saveError,
    remove,
    deleting,
    deleteError,
  } = useMembershipForm({ initial, defaultPlan, onSaved: onClose, onDeleted: onClose });

  const canSave = price.trim().length > 0 && !Number.isNaN(parseFloat(price));

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-2xl border border-border bg-foreground p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-color">
            {initial ? `Modifica ${PLAN_LABELS[plan]}` : `Configura ${PLAN_LABELS[plan]}`}
          </h2>
          <button onClick={onClose} className="text-disabled hover:text-text-color" aria-label="Chiudi">
            ✕
          </button>
        </div>

        <Input name="description" label="Descrizione" value={description} onChangeText={setDescription} />

        <div className="flex gap-3">
          <Input name="price" label="Prezzo" value={price} onChangeText={setPrice} required />
          <Input name="currency" label="Valuta" value={currency} onChangeText={setCurrency} />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text-color">Fatturazione</span>
          <select
            value={billing}
            onChange={(e) => setBilling(e.target.value as (typeof BILLING_OPTIONS)[number])}
            className="w-full rounded-[10px] border-[1.5px] border-border bg-foreground px-3.5 py-3 text-sm text-text-color"
          >
            {BILLING_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {BILLING_LABELS[option]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <Input name="maxLists" label="Max liste (vuoto = illimitato)" value={maxLists} onChangeText={setMaxLists} />
          <Input
            name="maxItemsPerList"
            label="Max item/lista (vuoto = illimitato)"
            value={maxItemsPerList}
            onChangeText={setMaxItemsPerList}
          />
        </div>

        {saveError && <FormError message={saveError.message} />}
        {deleteError && <FormError message={deleteError.message} />}

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <Button label={initial ? 'Salva modifiche' : 'Crea pacchetto'} loading={saving} disabled={!canSave} onClick={save} />

          {initial && (
            <>
              {confirmingDelete ? (
                <div className="flex gap-2">
                  <Button variant="destructive" label="Conferma eliminazione" loading={deleting} onClick={remove} />
                  <Button variant="ghost" label="Annulla" onClick={() => setConfirmingDelete(false)} />
                </div>
              ) : (
                <Button variant="destructive" label="Elimina pacchetto" onClick={() => setConfirmingDelete(true)} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
