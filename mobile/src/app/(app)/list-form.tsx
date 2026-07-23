import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { ColorPickerRow } from '@/components/atoms/color-picker-row';
import { SelectableChip } from '@/components/atoms/selectable-chip';
import { ConfirmSheet } from '@/components/molecules/confirm-sheet';
import { useListCategories } from '@/utils/useListCategories';
import { useListDetail } from '@/utils/useListDetail';
import { useListMutations } from '@/utils/useListMutations';

const LIST_COLORS = [
  Colors.light.accent,
  Colors.light.secondary,
  Colors.light.warning,
  Colors.light.success,
  Colors.light.primary,
];

export default function ListFormScreen() {
  const { t } = useTranslation('lists');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);

  const { list } = useListDetail(id);
  const { categories } = useListCategories();
  const { createList, updateList, deleteList, saving, deleting, error } = useListMutations();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<string>(LIST_COLORS[0]);
  const [isHidden, setIsHidden] = useState(false);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // precompilo il form quando arrivano i dati della lista in modifica
  useEffect(() => {
    if (!isEdit || !list) return;
    setName(list.name);
    setIcon(list.icon);
    setDescription(list.description ?? '');
    setColor(list.color);
    setIsHidden(list.isHidden);
    setCategoryIds(list.categories.map((c) => c.id));
  }, [isEdit, list]);

  const toggleCategory = (catId: string) => {
    setCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId],
    );
  };

  const save = async () => {
    setLocalError(null);
    if (!name.trim() || !icon.trim()) {
      setLocalError(t('form.missingFields'));
      return;
    }
    const input = {
      name: name.trim(),
      icon: icon.trim(),
      color,
      description: description.trim() || null,
      isHidden,
      categoryIds,
    };
    try {
      if (isEdit && id) {
        await updateList(id, input);
      } else {
        await createList(input);
      }
      router.back();
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  const handleDeleteConfirmed = async () => {
    setShowDeleteConfirm(false);
    if (!id) return;
    await deleteList(id);
    router.replace('/(app)');
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
            {isEdit ? t('form.titleEdit') : t('form.titleCreate')}
          </Text>
        </View>

        <Input
          colorScheme={colorScheme}
          placeholder={t('form.namePlaceholder')}
          value={name}
          onChangeText={setName}
        />
        <Input
          colorScheme={colorScheme}
          placeholder={t('form.iconPlaceholder')}
          value={icon}
          onChangeText={setIcon}
        />
        <Input
          colorScheme={colorScheme}
          placeholder={t('form.descriptionPlaceholder')}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={[styles.sectionLabel, { color: colors.text }]}>{t('form.color')}</Text>
        <ColorPickerRow
          colors={LIST_COLORS}
          selected={color}
          onSelect={setColor}
          colorScheme={colorScheme}
        />

        {categories.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>
              {t('form.categories')}
            </Text>
            <View style={styles.chipWrap}>
              {categories.map((cat) => (
                <SelectableChip
                  key={cat.id}
                  label={`${cat.icon} ${cat.name}`}
                  selected={categoryIds.includes(cat.id)}
                  onPress={() => toggleCategory(cat.id)}
                  colorScheme={colorScheme}
                />
              ))}
            </View>
          </>
        )}

        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>{t('form.hidden')}</Text>
          <Switch value={isHidden} onValueChange={setIsHidden} />
        </View>

        {displayError && <Text style={styles.error}>{displayError}</Text>}

        <Button
          colorScheme={colorScheme}
          label={isEdit ? t('form.save') : t('form.create')}
          onPress={save}
          loading={saving}
        />

        {isEdit && (
          <Button
            colorScheme={colorScheme}
            variant="secondary"
            label={t('form.delete')}
            onPress={() => setShowDeleteConfirm(true)}
            loading={deleting}
          />
        )}
      </ScrollView>

      <ConfirmSheet
        visible={showDeleteConfirm}
        title={t('form.deleteConfirmTitle')}
        message={t('form.deleteConfirmMessage')}
        confirmLabel={t('form.delete')}
        cancelLabel={t('form.cancel')}
        colorScheme={colorScheme}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setShowDeleteConfirm(false)}
      />
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
  },
  title: {
    fontSize: 26,
  },
  sectionLabel: {
    fontSize: 16,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 16,
  },
  error: {
    fontSize: 14,
    color: Colors.light.error,
    textAlign: 'center',
  },
});
