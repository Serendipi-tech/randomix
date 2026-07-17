import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthButton } from '@/components/atoms/auth-button';
import { AuthInput } from '@/components/atoms/auth-input';
import { SelectableChip } from '@/components/atoms/selectable-chip';
import { useItemMutations } from '@/utils/useItemMutations';
import { ITEM_CATEGORIES, type Category } from '@/utils/useListCategories';
import type { CompletionStatus } from '@/utils/useListDetail';

const STATUSES: CompletionStatus[] = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];

type ItemFormParams = {
  listId?: string;
  userItemId?: string;
  name?: string;
  category?: string;
  description?: string;
  note?: string;
  status?: string;
};

export default function ItemFormScreen() {
  const { t } = useTranslation('lists');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const params = useLocalSearchParams<ItemFormParams>();
  const isEdit = Boolean(params.userItemId);

  const { addItemToList, updateUserItem, saving, error } = useItemMutations();

  const [name, setName] = useState(params.name ?? '');
  const [category, setCategory] = useState<Category | null>(
    (params.category as Category | undefined) ?? null,
  );
  const [description, setDescription] = useState(params.description ?? '');
  const [note, setNote] = useState(params.note ?? '');
  const [status, setStatus] = useState<CompletionStatus>(
    (params.status as CompletionStatus | undefined) ?? 'NOT_STARTED',
  );
  const [localError, setLocalError] = useState<string | null>(null);

  const save = async () => {
    setLocalError(null);
    try {
      if (isEdit && params.userItemId) {
        await updateUserItem(params.userItemId, {
          description: description.trim() || null,
          note: note.trim() || null,
          status,
        });
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
  error: {
    fontSize: 14,
    color: '#E53E3E',
    textAlign: 'center',
    fontFamily: 'Nunito_500Medium',
  },
});
