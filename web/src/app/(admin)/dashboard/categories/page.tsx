'use client';

import { useState } from 'react';
import { useCategories, type Category } from '@/utils/useCategories';
import { getLucideIcon } from '@/utils/lucideIconRegistry';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import { CategoryFormModal } from '@/components/organisms/CategoryFormModal';

export default function CategoriesPage() {
  const { categories, loading, refetch } = useCategories();
  const [modalState, setModalState] = useState<'create' | Category | null>(null);

  const closeModal = () => {
    setModalState(null);
    refetch();
  };

  return (
    <main className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-color">Categorie item</h1>
        <Button label="Nuova categoria" onClick={() => setModalState('create')} />
      </div>

      {loading && categories.length === 0 && <p className="text-disabled">Caricamento…</p>}
      {!loading && categories.length === 0 && <p className="text-disabled">Nessuna categoria creata.</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {categories.map((category: Category) => {
          const Icon = getLucideIcon(category.icon);
          return (
            <Card key={category.id} onClick={() => setModalState(category)}>
              <div className="flex items-center gap-2 text-text-color">
                {Icon && <Icon size={18} />}
                <span className="truncate text-sm font-semibold">{category.name}</span>
              </div>
              <p className="text-xs text-disabled">
                {category.itemsCount} item · {category.listCategoriesCount} macro-categorie
              </p>
            </Card>
          );
        })}
      </div>

      {modalState && <CategoryFormModal category={modalState === 'create' ? null : modalState} onClose={closeModal} />}
    </main>
  );
}
