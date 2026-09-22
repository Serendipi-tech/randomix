'use client';

import { useState } from 'react';
import { useSystemTagForm } from '@/utils/useSystemTagForm';
import type { SystemTag } from '@/utils/useSystemTags';
import { TAG_COLORS } from '@/utils/tagColors';
import { Input } from '@/components/molecules/Input';
import { Button } from '@/components/atoms/Button';
import { FormError } from '@/components/molecules/FormError';
import { ColorPickerSheet } from '@/components/organisms/ColorPickerSheet';

interface SystemTagFormModalProps {
  tag: SystemTag;
  onClose: () => void;
}

export function SystemTagFormModal({ tag, onClose }: SystemTagFormModalProps) {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const { name, setName, color, setColor, save, saving, saveError, remove, deleting, deleteError } = useSystemTagForm({
    tag,
    onSaved: onClose,
    onDeleted: onClose,
  });

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
          <h2 className="text-lg font-semibold text-text-color">Modifica tag di sistema</h2>
          <button onClick={onClose} className="text-disabled hover:text-text-color" aria-label="Chiudi">
            ✕
          </button>
        </div>

        <Input name="name" label="Nome" value={name} onChangeText={setName} required />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text-color">Colore</span>
          <button
            type="button"
            onClick={() => setColorPickerOpen(true)}
            className="flex w-fit items-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 hover:bg-background/70"
          >
            <span className="h-5 w-5 rounded-md" style={{ backgroundColor: color }} />
            <span className="text-text-color">{color}</span>
          </button>
        </div>

        {saveError && <FormError message={saveError.message} />}
        {deleteError && <FormError message={deleteError.message} />}

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <Button label="Salva modifiche" loading={saving} disabled={!name.trim()} onClick={save} />

          {confirmingDelete ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-text-color">Confermi l&apos;eliminazione del tag di sistema?</p>
              <div className="flex gap-2">
                <Button variant="destructive" label="Conferma eliminazione" loading={deleting} onClick={remove} />
                <Button variant="ghost" label="Annulla" onClick={() => setConfirmingDelete(false)} />
              </div>
            </div>
          ) : (
            <Button variant="destructive" label="Elimina tag" onClick={() => setConfirmingDelete(true)} />
          )}
        </div>
      </div>

      <ColorPickerSheet
        open={colorPickerOpen}
        onClose={() => setColorPickerOpen(false)}
        colors={TAG_COLORS}
        selected={color}
        onSelect={setColor}
      />
    </div>
  );
}
