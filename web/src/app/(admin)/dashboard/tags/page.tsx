'use client';

import { useState } from 'react';
import { useTagGroups, type AdminTagGroup } from '@/utils/useTagGroups';
import { useSystemTags, type SystemTag } from '@/utils/useSystemTags';
import { usePromoteTag } from '@/utils/usePromoteTag';
import { Button } from '@/components/atoms/Button';
import { FormError } from '@/components/molecules/FormError';
import { Card } from '@/components/molecules/Card';
import { SystemTagFormModal } from '@/components/organisms/SystemTagFormModal';

function TagGroupCard({ group, onPromoted }: { group: AdminTagGroup; onPromoted: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const { promoteTag, promoting, error } = usePromoteTag();

  const handlePromote = async () => {
    await promoteTag(group.name);
    setConfirming(false);
    onPromoted();
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="truncate text-sm font-semibold text-text-color">{group.name}</span>
        <div className="flex gap-1">
          {group.colors.map((c) => (
            <span key={c.color} className="h-4 w-4 rounded-sm" style={{ backgroundColor: c.color }} title={`${c.count}x`} />
          ))}
        </div>
      </div>
      <p className="text-xs text-disabled">
        {group.personalCount} personali · {group.distinctUsersCount} utenti · {group.totalItemsCount} item
      </p>
      {group.existingSystemTagId && <p className="text-xs text-accent">Già promosso, verrà accorpato</p>}

      {error && <FormError message={error.message} />}

      {confirming ? (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" label="Conferma" loading={promoting} onClick={handlePromote} />
          <Button size="sm" variant="ghost" label="Annulla" onClick={() => setConfirming(false)} />
        </div>
      ) : (
        <Button size="sm" variant="secondary" label="Promuovi a sistema" onClick={() => setConfirming(true)} />
      )}
    </Card>
  );
}

function SystemTagCard({ tag, onClick }: { tag: SystemTag; onClick: () => void }) {
  return (
    <Card onClick={onClick}>
      <div className="flex items-center gap-2">
        <span className="h-5 w-5 shrink-0 rounded-sm" style={{ backgroundColor: tag.color }} />
        <span className="truncate text-sm font-semibold text-text-color">{tag.name}</span>
      </div>
      <span className="text-xs text-disabled">{tag.itemsCount} item collegati</span>
    </Card>
  );
}

export default function TagsPage() {
  const { groups, loading: groupsLoading, refetch: refetchGroups } = useTagGroups();
  const { tags, loading: tagsLoading, refetch: refetchSystemTags } = useSystemTags();
  const [editingTag, setEditingTag] = useState<SystemTag | null>(null);

  const handlePromoted = () => {
    refetchGroups();
    refetchSystemTags();
  };

  const closeEditModal = () => {
    setEditingTag(null);
    refetchSystemTags();
    refetchGroups();
  };

  return (
    <main className="flex flex-col gap-8 p-8">
      <h1 className="text-2xl font-semibold text-text-color">Tag</h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text-color">Duplicati da promuovere</h2>
        {groupsLoading && groups.length === 0 && <p className="text-disabled">Caricamento…</p>}
        {!groupsLoading && groups.length === 0 && <p className="text-disabled">Nessun tag personale trovato.</p>}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {groups.map((group) => (
            <TagGroupCard key={group.name} group={group} onPromoted={handlePromoted} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text-color">Tag di sistema</h2>
        {tagsLoading && tags.length === 0 && <p className="text-disabled">Caricamento…</p>}
        {!tagsLoading && tags.length === 0 && <p className="text-disabled">Nessun tag di sistema creato.</p>}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {tags.map((tag) => (
            <SystemTagCard key={tag.id} tag={tag} onClick={() => setEditingTag(tag)} />
          ))}
        </div>
      </section>

      {editingTag && <SystemTagFormModal tag={editingTag} onClose={closeEditModal} />}
    </main>
  );
}
