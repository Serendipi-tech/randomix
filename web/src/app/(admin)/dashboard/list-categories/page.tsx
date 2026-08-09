'use client';

import { useState } from 'react';
import { useListCategories, type ListCategory } from '@/utils/useListCategories';
import { getLucideIcon } from '@/utils/lucideIconRegistry';
import { CATEGORY_LABELS } from '@/utils/categoryLabels';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Card } from '@/components/molecules/Card';
import { ListCategoryFormModal } from '@/components/organisms/ListCategoryFormModal';

export default function ListCategoriesPage() {
  const { categories, loading, refetch } = useListCategories();
  const [modalState, setModalState] = useState<'create' | ListCategory | null>(null);

  const closeModal = () => {
    setModalState(null);
    refetch();
  };

  return (
    <main className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-color">Categorie liste</h1>
        <Button label="Nuova categoria" onClick={() => setModalState('create')} />
      </div>

      {loading && categories.length === 0 && <p className="text-disabled">Caricamento…</p>}
      {!loading && categories.length === 0 && <p className="text-disabled">Nessuna categoria creata.</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {categories.map((category) => {
          const Icon = getLucideIcon(category.icon);
          return (
            <Card key={category.id} onClick={() => setModalState(category)}>
              <div className="flex items-center gap-2 text-text-color">
                {Icon && <Icon size={18} />}
                <span className="truncate text-sm font-semibold">{category.name}</span>
              </div>
              {category.description && <p className="truncate text-xs text-disabled">{category.description}</p>}
              <div className="flex flex-wrap gap-1">
                {category.includedCategories.slice(0, 3).map((cat) => (
                  <Badge key={cat} label={CATEGORY_LABELS[cat] ?? cat} color="var(--accent)" />
                ))}
                {category.includedCategories.length > 3 && (
                  <Badge label={`+${category.includedCategories.length - 3}`} color="var(--disabled)" />
                )}
              </div>
              <p className="text-xs text-disabled">
                {category.listsCount} liste · {category.groupListsCount} gruppo
              </p>
            </Card>
          );
        })}
      </div>

      {modalState && <ListCategoryFormModal category={modalState === 'create' ? null : modalState} onClose={closeModal} />}
    </main>
  );
}
