import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { ConfirmSheet } from '@/components/molecules/confirm-sheet';
import { Input } from '@/components/molecules/Input';
import { Tag } from '@/components/atoms/Tag';
import { TagCreateSheet } from '@/components/organisms/TagCreateSheet';
import type { Tag as TagData } from '@/utils/useTags';

type TagPickerSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** Tag disponibili: personali dell'utente + di sistema (già uniti da useTags). */
  tags: TagData[];
  selectedIds: string[];
  /** Tap su un tag: seleziona o deseleziona, la logica di toggle resta al chiamante. */
  onSelect: (tag: TagData) => void;
  onCreate: (name: string, color: string) => Promise<TagData | null>;
  /** Solo i tag personali (non di sistema) possono essere modificati. */
  onUpdate: (id: string, name: string, color: string) => Promise<TagData | null>;
  saving: boolean;
  /** Solo i tag personali (non di sistema) possono essere eliminati. */
  onDelete: (tag: TagData) => Promise<void>;
  deleting: boolean;
  newTagTitle: string;
  editTagTitle: string;
  newTagPlaceholder: string;
  addLabel: string;
  saveLabel: string;
  searchPlaceholder: string;
  emptyLabel: string;
};

/** Bottomsheet di scelta tag (multi-select): il "+" accanto alla ricerca apre la TagCreateSheet
 *  dedicata per creare. Sotto, chip in griglia flex, ordine alfabetico, divise in "Tuoi tag" /
 *  "Di sistema" solo se entrambe le categorie hanno risultati. I tag personali hanno matita (modifica,
 *  stessa TagCreateSheet in modalità edit) e ✕ (elimina, con conferma). */
export function TagPickerSheet({
  visible,
  onClose,
  tags,
  selectedIds,
  onSelect,
  onCreate,
  onUpdate,
  saving,
  onDelete,
  deleting,
  newTagTitle,
  editTagTitle,
  newTagPlaceholder,
  addLabel,
  saveLabel,
  searchPlaceholder,
  emptyLabel,
}: TagPickerSheetProps) {
  const { t } = useTranslation('lists');
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const [showCreate, setShowCreate] = useState(false);
  const [editingTag, setEditingTag] = useState<TagData | null>(null);
  const [search, setSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState<TagData | null>(null);

  const trimmedSearch = search.trim();

  const sorted = useMemo(
    () => [...tags].sort((a, b) => a.name.localeCompare(b.name, 'it', { sensitivity: 'base' })),
    [tags],
  );

  const filtered = useMemo(() => {
    const query = trimmedSearch.toLowerCase();
    if (!query) return sorted;
    return sorted.filter((tag) => tag.name.toLowerCase().includes(query));
  }, [sorted, trimmedSearch]);

  const system = useMemo(() => filtered.filter((tag) => tag.isSystem), [filtered]);
  const mine = useMemo(() => filtered.filter((tag) => !tag.isSystem), [filtered]);
  // Le due sezioni si mostrano solo quando entrambe hanno risultati: altrimenti è una lista sola, senza bisogno di dividerla
  const showSections = system.length > 0 && mine.length > 0;

  // Non creo un duplicato: se il nome coincide con un tag già visibile (mio o di sistema) lo seleziono e basta
  const handleCreate = async (name: string, color: string) => {
    const existing = tags.find((tag) => tag.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      onSelect(existing);
      setShowCreate(false);
      return;
    }
    const created = await onCreate(name, color);
    if (created) setShowCreate(false);
  };

  const handleUpdate = async (id: string, name: string, color: string) => {
    const updated = await onUpdate(id, name, color);
    if (updated) setEditingTag(null);
  };

  const handleConfirmDelete = async () => {
    if (pendingDelete) await onDelete(pendingDelete);
    setPendingDelete(null);
  };

  const renderChip = (tag: TagData) => {
    const isSelected = selectedIds.includes(tag.id);
    return (
      <Pressable key={tag.id} onPress={() => onSelect(tag)} style={[styles.chip, isSelected && { borderColor: colors.primary }]}>
        <Tag
          name={tag.name}
          color={tag.color}
          onEdit={!tag.isSystem ? () => setEditingTag(tag) : undefined}
          onRemove={!tag.isSystem ? () => setPendingDelete(tag) : undefined}
        />
      </Pressable>
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.searchRow}>
        <Input
          variant="text"
          value={search}
          onChangeText={setSearch}
          placeholder={searchPlaceholder}
          style={styles.searchInput}
        />
        <Pressable
          onPress={() => setShowCreate(true)}
          style={[styles.toggleButton, { backgroundColor: colors.foreground }]}
        >
          <Plus size={22} color={colors.primary} strokeWidth={2.5} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <Text style={[styles.empty, { color: colors.disabled }]}>{emptyLabel}</Text>
        ) : showSections ? (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.disabled }]}>{t('itemForm.tagsMine')}</Text>
              <View style={styles.grid}>{mine.map(renderChip)}</View>
            </View>
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.disabled }]}>{t('itemForm.tagsSystem')}</Text>
              <View style={styles.grid}>{system.map(renderChip)}</View>
            </View>
          </>
        ) : (
          <View style={styles.grid}>{filtered.map(renderChip)}</View>
        )}
      </ScrollView>

      <ConfirmSheet
        visible={pendingDelete != null}
        title={t('itemForm.tagDeleteConfirmTitle')}
        message={t('itemForm.tagDeleteConfirmMessage')}
        confirmLabel={t('itemForm.delete')}
        cancelLabel={t('itemForm.cancel')}
        colorScheme={colorScheme}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <TagCreateSheet
        visible={showCreate || editingTag != null}
        onClose={() => {
          setShowCreate(false);
          setEditingTag(null);
        }}
        editingTag={editingTag}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        saving={saving}
        createTitle={newTagTitle}
        editTitle={editTagTitle}
        namePlaceholder={newTagPlaceholder}
        addLabel={addLabel}
        saveLabel={saveLabel}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
  },
  toggleButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 20,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  empty: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 24,
  },
});
