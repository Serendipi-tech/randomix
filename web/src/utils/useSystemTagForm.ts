'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { AdminTagMutations } from '@randomix/graphql-schema';
import type { SystemTag } from './useSystemTags';

const { ADMIN_UPDATE_SYSTEM_TAG, ADMIN_DELETE_SYSTEM_TAG } = AdminTagMutations;

interface UseSystemTagFormOptions {
  tag: SystemTag;
  onSaved: () => void;
  onDeleted: () => void;
}

export function useSystemTagForm({ tag, onSaved, onDeleted }: UseSystemTagFormOptions) {
  const [name, setName] = useState(tag.name);
  const [color, setColor] = useState(tag.color);

  const [updateTag, { loading: saving, error: saveError }] = useMutation(ADMIN_UPDATE_SYSTEM_TAG);
  const [deleteTag, { loading: deleting, error: deleteError }] = useMutation(ADMIN_DELETE_SYSTEM_TAG);

  const save = async () => {
    await updateTag({ variables: { id: tag.id, name, color } });
    onSaved();
  };

  const remove = async () => {
    await deleteTag({ variables: { id: tag.id } });
    onDeleted();
  };

  return { name, setName, color, setColor, save, saving, saveError, remove, deleting, deleteError };
}
