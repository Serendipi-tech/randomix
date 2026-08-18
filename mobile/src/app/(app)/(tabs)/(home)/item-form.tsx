import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Plus } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/molecules/Input';
import { PageHeader } from '@/components/molecules/PageHeader';
import { TagList } from '@/components/molecules/TagList';
import { CategoryPickerSheet, type CategoryOption } from '@/components/organisms/CategoryPickerSheet';
import { TagPickerSheet } from '@/components/organisms/TagPickerSheet';
import { useItemMutations } from '@/utils/useItemMutations';
import { useListCategories, type Category } from '@/utils/useListCategories';
import { useListDetail } from '@/utils/useListDetail';
import { useTags, type Tag as TagData } from '@/utils/useTags';

type ItemFormParams = {
  listId?: string;
};

/** Schermata di sola creazione item: nome, categoria (dalla lista padre) e descrizione personale.
 *  Ogni modifica successiva avviene nel bottomsheet ItemCardDetails, non qui. */
export default function ItemFormScreen() {
  const { t } = useTranslation('lists');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const params = useLocalSearchParams<ItemFormParams>();

  const { addItemToList, updateUserItem, saving, error } = useItemMutations();
  const { list } = useListDetail(params.listId);
  const { categories: allMacroCategories } = useListCategories();
  const {
    tags: existingTags,
    createTag,
    updateTag,
    deleteTag,
    creating: creatingTag,
    updating: updatingTag,
    deleting: deletingTag,
  } = useTags();

  // Categorie sceglibili = unione degli includedCategories delle macro-categorie della lista padre
  const categoryOptions = useMemo<CategoryOption[]>(() => {
    const listMacroIds = new Set((list?.categories ?? []).map((c) => c.id));
    const values = new Set<Category>();
    allMacroCategories
      .filter((macro) => listMacroIds.has(macro.id))
      .forEach((macro) => macro.includedCategories.forEach((value) => values.add(value)));
    return Array.from(values).map((value) => ({ value, label: t(`categories.${value}`) }));
  }, [allMacroCategories, list, t]);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [description, setDescription] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const [selectedTags, setSelectedTags] = useState<TagData[]>([]);
  const [showTagPicker, setShowTagPicker] = useState(false);

  // Toggle: tap su un tag già selezionato lo rimuove, altrimenti lo aggiunge
  const toggleTag = (tag: TagData) => {
    setSelectedTags((prev) => (prev.some((t) => t.id === tag.id) ? prev.filter((t) => t.id !== tag.id) : [...prev, tag]));
  };

  // Se il tag eliminato era selezionato per questo item, lo scollego anche da qui
  const handleDeleteTag = async (tag: TagData) => {
    await deleteTag(tag.id);
    setSelectedTags((prev) => prev.filter((t) => t.id !== tag.id));
  };

  // Se il tag modificato era selezionato, aggiorno anche la chip mostrata qui
  const handleUpdateTag = async (id: string, name: string, color: string) => {
    const updated = await updateTag(id, name, color);
    if (updated) setSelectedTags((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const save = async () => {
    setLocalError(null);
    if (!name.trim() || !category || !params.listId) {
      setLocalError(t('itemForm.missingFields'));
      return;
    }
    try {
      const userItemId = await addItemToList({
        listId: params.listId,
        name: name.trim(),
        category,
        description: description.trim() || null,
      });
      if (userItemId && selectedTags.length > 0) {
        await updateUserItem(userItemId, { tagIds: selectedTags.map((tag) => tag.id) });
      }
      router.back();
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  const displayError = localError ?? error?.message ?? null;

  return (
    <SafeAreaView style={styles.safe}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader icon={Package} title={t('itemForm.titleAdd')} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Input
          label={t('itemForm.name')}
          required
          placeholder={t('itemForm.namePlaceholder')}
          value={name}
          onChangeText={setName}
        />

        <View>
          <Text style={[styles.fieldLabel, { color: colors.textColor }]}>{t('itemForm.category')}</Text>
          <Button
            variant="soft"
            label={category ? t(`categories.${category}`) : t('itemForm.categoryPlaceholder')}
            onPress={() => setShowCategoryPicker(true)}
          />
        </View>

        <Input
          label={t('itemForm.description')}
          placeholder={t('itemForm.descriptionPlaceholder')}
          value={description}
          onChangeText={setDescription}
          variant="textarea"
        />

        <View>
          <View style={styles.tagsHeader}>
            <Text style={[styles.fieldLabel, { color: colors.textColor, marginBottom: 0 }]}>{t('itemForm.tags')}</Text>
            <Pressable onPress={() => setShowTagPicker(true)} style={styles.iconButton}>
              <Plus size={24} color={colors.primary} />
            </Pressable>
          </View>
          <TagList
            tags={selectedTags}
            maxLines={2}
            onRemoveTag={(index) => setSelectedTags((prev) => prev.filter((_, i) => i !== index))}
          />
        </View>

        {displayError && <Text style={styles.error}>{displayError}</Text>}
      </ScrollView>

      {/* Azioni fisse in fondo alla pagina, stessa struttura di list-form */}
      <View style={styles.footer}>
        <View style={styles.actionItem}>
          <Button variant="secondary" label={t('itemForm.cancel')} onPress={() => router.back()} />
        </View>
        <View style={styles.actionItem}>
          <Button variant="primary" label={t('itemForm.add')} onPress={save} loading={saving} />
        </View>
      </View>

      <CategoryPickerSheet
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        options={categoryOptions}
        selected={category}
        onSelect={setCategory}
        searchPlaceholder={t('itemForm.categorySearch')}
        emptyLabel={t('itemForm.noCategories')}
      />

      <TagPickerSheet
        visible={showTagPicker}
        onClose={() => setShowTagPicker(false)}
        tags={existingTags}
        selectedIds={selectedTags.map((tag) => tag.id)}
        onSelect={toggleTag}
        onCreate={createTag}
        onUpdate={handleUpdateTag}
        saving={creatingTag || updatingTag}
        onDelete={handleDeleteTag}
        deleting={deletingTag}
        newTagTitle={t('itemForm.newTag')}
        editTagTitle={t('itemForm.editTag')}
        newTagPlaceholder={t('itemForm.newTagPlaceholder')}
        addLabel={t('itemForm.addTag')}
        saveLabel={t('itemForm.save')}
        searchPlaceholder={t('itemForm.tagSearchPlaceholder')}
        emptyLabel={t('itemForm.tagsEmpty')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  error: {
    fontSize: 14,
    color: Colors.light.error,
    textAlign: 'center',
  },
  tagsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  // Area tattile reale (non hitSlop): stesso pattern del "+" nota in ItemCardDetails
  iconButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
  },
  actionItem: {
    flex: 1,
  },
});
