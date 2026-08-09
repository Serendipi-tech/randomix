'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ListCategoryMutations } from '@randomix/graphql-schema';
import type { ListCategory } from './useListCategories';

const { ADMIN_CREATE_LIST_CATEGORY, ADMIN_UPDATE_LIST_CATEGORY, ADMIN_DELETE_LIST_CATEGORY } = ListCategoryMutations;

interface UseListCategoryFormOptions {
  initial?: ListCategory | null;
  onSaved: () => void;
  onDeleted: () => void;
}

// Un solo hook per creazione/modifica/eliminazione: la modale li riusa entrambi in base a `initial`.
export function useListCategoryForm({ initial, onSaved, onDeleted }: UseListCategoryFormOptions) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [icon, setIcon] = useState(initial?.icon ?? '');
  const [includedCategories, setIncludedCategories] = useState<string[]>(initial?.includedCategories ?? []);

  const [createCategory, { loading: creating, error: createError }] = useMutation(ADMIN_CREATE_LIST_CATEGORY);
  const [updateCategory, { loading: updating, error: updateError }] = useMutation(ADMIN_UPDATE_LIST_CATEGORY);
  const [deleteCategory, { loading: deleting, error: deleteError }] = useMutation(ADMIN_DELETE_LIST_CATEGORY);

  const toggleCategory = (category: string) => {
    setIncludedCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));
  };

  const save = async () => {
    const input = { name, description: description || null, icon, includedCategories };
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
    description,
    setDescription,
    icon,
    setIcon,
    includedCategories,
    toggleCategory,
    save,
    saving: creating || updating,
    saveError: createError ?? updateError,
    remove,
    deleting,
    deleteError,
  };
}
