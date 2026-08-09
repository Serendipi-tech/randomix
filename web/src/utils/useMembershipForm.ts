'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { AdminMembershipMutations } from '@randomix/graphql-schema';
import type { Membership } from './useMemberships';
import type { MembershipPlan, BillingOption } from './membershipLabels';

const { ADMIN_CREATE_MEMBERSHIP, ADMIN_UPDATE_MEMBERSHIP, ADMIN_DELETE_MEMBERSHIP } = AdminMembershipMutations;

interface UseMembershipFormOptions {
  initial?: Membership | null;
  defaultPlan?: MembershipPlan;
  onSaved: () => void;
  onDeleted: () => void;
}

// Un solo hook per creazione/modifica/eliminazione, come per ListCategory: la modale lo riusa in
// entrambe le modalità in base a `initial`. Il piano è fisso in modifica (viene dal record esistente),
// selezionabile solo in creazione (defaultPlan = slot cliccato).
export function useMembershipForm({ initial, defaultPlan, onSaved, onDeleted }: UseMembershipFormOptions) {
  const [plan, setPlan] = useState<MembershipPlan>(initial?.plan ?? defaultPlan ?? 'FREE');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [price, setPrice] = useState(initial ? String(initial.price) : '');
  const [currency, setCurrency] = useState(initial?.currency ?? 'EUR');
  const [billing, setBilling] = useState<BillingOption>(initial?.billing ?? 'MONTHLY');
  const [maxLists, setMaxLists] = useState(initial?.maxLists != null ? String(initial.maxLists) : '');
  const [maxItemsPerList, setMaxItemsPerList] = useState(
    initial?.maxItemsPerList != null ? String(initial.maxItemsPerList) : '',
  );

  const [createMembership, { loading: creating, error: createError }] = useMutation(ADMIN_CREATE_MEMBERSHIP);
  const [updateMembership, { loading: updating, error: updateError }] = useMutation(ADMIN_UPDATE_MEMBERSHIP);
  const [deleteMembership, { loading: deleting, error: deleteError }] = useMutation(ADMIN_DELETE_MEMBERSHIP);

  const save = async () => {
    const input = {
      plan,
      description: description || null,
      price: parseFloat(price),
      currency,
      billing,
      maxLists: maxLists.trim() ? parseInt(maxLists, 10) : null,
      maxItemsPerList: maxItemsPerList.trim() ? parseInt(maxItemsPerList, 10) : null,
    };

    if (initial) {
      await updateMembership({ variables: { id: initial.id, input } });
    } else {
      await createMembership({ variables: { input } });
    }
    onSaved();
  };

  const remove = async () => {
    if (!initial) return;
    await deleteMembership({ variables: { id: initial.id } });
    onDeleted();
  };

  return {
    plan,
    setPlan,
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
    saving: creating || updating,
    saveError: createError ?? updateError,
    remove,
    deleting,
    deleteError,
  };
}
