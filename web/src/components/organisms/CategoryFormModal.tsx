'use client';

import { useState } from 'react';
import { useCategoryForm } from '@/utils/useCategoryForm';
import type { Category } from '@/utils/useCategories';
import { getLucideIcon } from '@/utils/lucideIconRegistry';
import { Input } from '@/components/molecules/Input';
import { Button } from '@/components/atoms/Button';
import { FormError } from '@/components/molecules/FormError';
import { IconPickerSheet } from '@/components/organisms/IconPickerSheet';

interface CategoryFormModalProps {
  category: Category | null;
  onClose: () => void;
}

export function CategoryFormModal({ category, onClose }: CategoryFormModalProps) {
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const { name, setName, icon, setIcon, save, saving, saveError, remove, deleting, deleteError } = useCategoryForm({
    initial: category,
    onSaved: onClose,
    onDeleted: onClose,
  });

  const SelectedIcon = icon ? getLucideIcon(icon) : null;
  const canSave = name.trim().length > 0 && icon.length > 0;
  const inUse = category ? category.itemsCount + category.listCategoriesCount > 0 : false;

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

        {saveError && <FormError message={saveError.message} />}
        {deleteError && <FormError message={deleteError.message} />}

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <Button label={category ? 'Salva modifiche' : 'Crea categoria'} loading={saving} disabled={!canSave} onClick={save} />

          {category && (
            <>
              {confirmingDelete ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-text-color">
                    Confermi l&apos;eliminazione? {inUse && 'Non è possibile: è in uso.'}
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
