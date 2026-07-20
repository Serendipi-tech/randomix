import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Accent, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthButton } from '@/components/atoms/auth-button';
import { AuthInput } from '@/components/atoms/auth-input';
import { SelectableChip } from '@/components/atoms/selectable-chip';
import { StarRating } from '@/components/atoms/star-rating';
import { useItemMutations } from '@/utils/useItemMutations';
import { ITEM_CATEGORIES, type Category } from '@/utils/useListCategories';
import { useTags } from '@/utils/useTags';
import type { CompletionStatus } from '@/utils/useListDetail';

const STATUSES: CompletionStatus[] = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];
const TAG_COLORS = [Accent.primary, Accent.coral, Accent.yellow, Accent.mint, Accent.violet];

type ItemFormParams = {
  listId?: string;
  userItemId?: string;
  itemId?: string;
  name?: string;
  category?: string;
  description?: string;
  note?: string;
  status?: string;
  rating?: string;
  ratingNote?: string;
  tagIds?: string;
};

export default function ItemFormScreen() {
  const { t } = useTranslation('lists');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const params = useLocalSearchParams<ItemFormParams>();
  const isEdit = Boolean(params.userItemId);

  const { addItemToList, updateUserItem, rateItem, saving, error } = useItemMutations();
  const { tags, createTag, creating } = useTags();

  const [name, setName] = useState(params.name ?? '');
  const [category, setCategory] = useState<Category | null>(
    (params.category as Category | undefined) ?? null,
  );
  const [description, setDescription] = useState(params.description ?? '');
  const [note, setNote] = useState(params.note ?? '');
  const [status, setStatus] = useState<CompletionStatus>(
    (params.status as CompletionStatus | undefined) ?? 'NOT_STARTED',
  );
  const [ratingValue, setRatingValue] = useState(Number(params.rating ?? 0));
  const [ratingNote, setRatingNote] = useState(params.ratingNote ?? '');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    params.tagIds ? params.tagIds.split(',') : [],
  );
  const [newTagName, setNewTagName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    );
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    setLocalError(null);
    try {
      const tag = await createTag(newTagName.trim(), TAG_COLORS[tags.length % TAG_COLORS.length]);
      if (tag) setSelectedTagIds((prev) => [...prev, tag.id]);
      setNewTagName('');
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  const save = async () => {
    setLocalError(null);
    try {
      if (isEdit && params.userItemId) {
        await updateUserItem(params.userItemId, {
          description: description.trim() || null,
          note: note.trim() || null,
          status,
          tagIds: selectedTagIds,
        });
        if (ratingValue > 0 && params.itemId) {
          await rateItem(params.itemId, ratingValue, ratingNote.trim() || null);
        }
      } else {
        if (!name.trim() || !category || !params.listId) {
          setLocalError(t('itemForm.missingFields'));
          return;
        }
        await addItemToList({
          listId: params.listId,
          name: name.trim(),
          category,
          description: description.trim() || null,
          note: note.trim() || null,
        });
      }
      router.back();
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  const displayError = localError ?? error?.message ?? null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={[styles.back, { color: colors.textSecondary }]}>{t('form.cancel')}</Text>
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>
            {isEdit ? t('itemForm.titleEdit') : t('itemForm.titleAdd')}
          </Text>
        </View>

        {isEdit ? (
          <Text style={[styles.itemName, { color: colors.text }]}>{name}</Text>
        ) : (
          <AuthInput
            colorScheme={colorScheme}
            placeholder={t('itemForm.namePlaceholder')}
            value={name}
            onChangeText={setName}
          />
        )}

        {!isEdit && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>
              {t('itemForm.category')}
            </Text>
            <View style={styles.chipWrap}>
              {ITEM_CATEGORIES.map((cat) => (
                <SelectableChip
                  key={cat}
                  label={t(`categories.${cat}`)}
                  selected={category === cat}
                  onPress={() => setCategory(cat)}
                  colorScheme={colorScheme}
                />
              ))}
            </View>
          </>
        )}

        <AuthInput
          colorScheme={colorScheme}
          placeholder={t('itemForm.descriptionPlaceholder')}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <AuthInput
          colorScheme={colorScheme}
          placeholder={t('itemForm.notePlaceholder')}
          value={note}
          onChangeText={setNote}
          multiline
        />

        {isEdit && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>
              {t('itemForm.status')}
            </Text>
            <View style={styles.chipWrap}>
              {STATUSES.map((s) => (
                <SelectableChip
                  key={s}
                  label={t(`status.${s}`)}
                  selected={status === s}
                  onPress={() => setStatus(s)}
                  colorScheme={colorScheme}
                />
              ))}
            </View>

            <Text style={[styles.sectionLabel, { color: colors.text }]}>
              {t('itemForm.rating')}
            </Text>
            <StarRating value={ratingValue} onChange={setRatingValue} colorScheme={colorScheme} />
            {ratingValue > 0 && (
              <AuthInput
                colorScheme={colorScheme}
                placeholder={t('itemForm.ratingNotePlaceholder')}
                value={ratingNote}
                onChangeText={setRatingNote}
                multiline
              />
            )}

            <Text style={[styles.sectionLabel, { color: colors.text }]}>
              {t('itemForm.tags')}
            </Text>
            {tags.length > 0 && (
              <View style={styles.chipWrap}>
                {tags.map((tag) => (
                  <SelectableChip
                    key={tag.id}
                    label={tag.name}
                    selected={selectedTagIds.includes(tag.id)}
                    onPress={() => toggleTag(tag.id)}
                    colorScheme={colorScheme}
                  />
                ))}
              </View>
            )}
            <View style={styles.newTagRow}>
              <AuthInput
                colorScheme={colorScheme}
                placeholder={t('itemForm.newTagPlaceholder')}
                value={newTagName}
                onChangeText={setNewTagName}
                style={styles.newTagInput}
              />
              <Pressable
                onPress={handleCreateTag}
                disabled={creating || !newTagName.trim()}
                style={[styles.addTagButton, (creating || !newTagName.trim()) && styles.disabled]}>
                <Text style={styles.addTagLabel}>{t('itemForm.addTag')}</Text>
              </Pressable>
            </View>
          </>
        )}

        {displayError && <Text style={styles.error}>{displayError}</Text>}

        <AuthButton
          colorScheme={colorScheme}
          label={isEdit ? t('itemForm.save') : t('itemForm.add')}
          onPress={save}
          loading={saving}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  topBar: {
    gap: Spacing.two,
  },
  back: {
    fontSize: 15,
    fontFamily: 'Nunito_500Medium',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Fredoka_700Bold',
  },
  itemName: {
    fontSize: 20,
    fontFamily: 'Fredoka_600SemiBold',
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'Fredoka_600SemiBold',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  newTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  newTagInput: {
    flex: 1,
  },
  addTagButton: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: Accent.violet,
  },
  addTagLabel: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Fredoka_600SemiBold',
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    fontSize: 14,
    color: '#E53E3E',
    textAlign: 'center',
    fontFamily: 'Nunito_500Medium',
  },
});
