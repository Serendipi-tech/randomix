'use client';

import { useState } from 'react';
import { useListCategoryForm } from '@/utils/useListCategoryForm';
import type { ListCategory } from '@/utils/useListCategories';
import { ALL_CATEGORIES, CATEGORY_LABELS } from '@/utils/categoryLabels';
import { getLucideIcon } from '@/utils/lucideIconRegistry';
import { Input } from '@/components/molecules/Input';
import { Chip } from '@/components/atoms/Chip';
import { Button } from '@/components/atoms/Button';
import { FormError } from '@/components/molecules/FormError';
import { IconPickerSheet } from '@/components/organisms/IconPickerSheet';

interface ListCategoryFormModalProps {
  category: ListCategory | null;
  onClose: () => void;
}

export function ListCategoryFormModal({ category, onClose }: ListCategoryFormModalProps) {
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const {
    name,
    setName,
    description,
    setDescription,
    icon,
    setIcon,
    includedCategories,
    toggleCategory,
    save,
    saving,
    saveError,
    remove,
    deleting,
    deleteError,
  } = useListCategoryForm({ initial: category, onSaved: onClose, onDeleted: onClose });

  const SelectedIcon = icon ? getLucideIcon(icon) : null;
  const canSave = name.trim().length > 0 && icon.length > 0;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-2xl border border-border bg-foreground p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-color">{category ? 'Modifica categoria' : 'Nuova categoria'}</h2>
          <button onClick={onClose} className="text-disabled hover:text-text-color" aria-label="Chiudi">
            ✕
          </button>
        </div>

        <Input name="name" label="Nome" value={name} onChangeText={setName} required />
        <Input name="description" label="Descrizione" value={description} onChangeText={setDescription} />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text-color">
            Icona<span className="text-error"> *</span>
          </span>
          <button
            type="button"
            onClick={() => setIconPickerOpen(true)}
            className="flex w-fit items-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 text-text-color hover:bg-background/70"
          >
            {SelectedIcon ? <SelectedIcon size={20} /> : null}
            {icon || 'Scegli icona…'}
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text-color">Categorie incluse</span>
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                label={CATEGORY_LABELS[cat]}
                selected={includedCategories.includes(cat)}
                onClick={() => toggleCategory(cat)}
              />
            ))}
          </div>
        </div>

        {saveError && <FormError message={saveError.message} />}
        {deleteError && <FormError message={deleteError.message} />}

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <Button label={category ? 'Salva modifiche' : 'Crea categoria'} loading={saving} disabled={!canSave} onClick={save} />

          {category && (
            <>
              {confirmingDelete ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-text-color">
                    Confermi l&apos;eliminazione? {category.listsCount + category.groupListsCount > 0 && 'Non è possibile: è in uso.'}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      label="Conferma eliminazione"
                      loading={deleting}
                      onClick={remove}
                    />
                    <Button variant="ghost" label="Annulla" onClick={() => setConfirmingDelete(false)} />
                  </div>
                </div>
              ) : (
                <Button variant="destructive" label="Elimina categoria" onClick={() => setConfirmingDelete(true)} />
              )}
            </>
          )}
        </div>
      </div>

      <IconPickerSheet open={iconPickerOpen} onClose={() => setIconPickerOpen(false)} selected={icon} onSelect={setIcon} />
    </div>
  );
}
