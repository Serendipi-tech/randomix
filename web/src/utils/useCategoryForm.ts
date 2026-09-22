'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CategoryMutations } from '@randomix/graphql-schema';
import type { Category } from './useCategories';

const { ADMIN_CREATE_CATEGORY, ADMIN_UPDATE_CATEGORY, ADMIN_DELETE_CATEGORY } = CategoryMutations;

interface UseCategoryFormOptions {
  initial?: Category | null;
  onSaved: () => void;
  onDeleted: () => void;
}

// Un solo hook per creazione/modifica/eliminazione: la modale li riusa entrambi in base a `initial`.
export function useCategoryForm({ initial, onSaved, onDeleted }: UseCategoryFormOptions) {
  const [name, setName] = useState(initial?.name ?? '');
  const [icon, setIcon] = useState(initial?.icon ?? '');

  const [createCategory, { loading: creating, error: createError }] = useMutation(ADMIN_CREATE_CATEGORY);
  const [updateCategory, { loading: updating, error: updateError }] = useMutation(ADMIN_UPDATE_CATEGORY);
  const [deleteCategory, { loading: deleting, error: deleteError }] = useMutation(ADMIN_DELETE_CATEGORY);

  const save = async () => {
    const input = { name, icon };
    if (initial) {
      await updateCategory({ variables: { id: initial.id, input } });
    } else {
      await createCategory({ variables: { input } });
    }
    onSaved();
  };

  const remove = async () => {
    if (!initial) return;
    await deleteCategory({ variables: { id: initial.id } });
    onDeleted();
  };

  return {
    name,
    setName,
    icon,
    setIcon,
    save,
    saving: creating || updating,
    saveError: createError ?? updateError,
    remove,
    deleting,
    deleteError,
  };
}
