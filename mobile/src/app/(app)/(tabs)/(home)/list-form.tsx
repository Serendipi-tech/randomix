import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { List } from 'lucide-react-native';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { DEFAULT_LIST_ICON_KEY, LIST_ICONS, type ListIconKey } from '@/constants/list-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/molecules/Input';
import { PageHeader } from '@/components/molecules/PageHeader';
import { ColorPickerRow } from '@/components/atoms/color-picker-row';
import { IconPickerRow } from '@/components/atoms/icon-picker-row';
import { Chip } from '@/components/atoms/Chip';
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
  const [icon, setIcon] = useState<ListIconKey>(DEFAULT_LIST_ICON_KEY);
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
    setIcon(LIST_ICONS.some((entry) => entry.key === list.icon) ? (list.icon as ListIconKey) : DEFAULT_LIST_ICON_KEY);
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
    if (!name.trim()) {
      setLocalError(t('form.missingFields'));
      return;
    }
    const input = {
      name: name.trim(),
      icon,
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
    router.replace('/(app)/(tabs)');
  };

  const displayError = localError ?? error?.message ?? null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <PageHeader
        icon={List}
        title={isEdit ? t('form.titleEdit') : t('form.titleCreate')}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Input
          placeholder={t('form.namePlaceholder')}
          value={name}
          onChangeText={setName}
        />
        <Input
          placeholder={t('form.descriptionPlaceholder')}
          value={description}
          onChangeText={setDescription}
          variant="textarea"
        />

        <Text style={[styles.sectionLabel, { color: colors.textColor }]}>{t('form.color')}</Text>
        <ColorPickerRow
          colors={LIST_COLORS}
          selected={color}
          onSelect={setColor}
          colorScheme={colorScheme}
        />

        <Text style={[styles.sectionLabel, { color: colors.textColor }]}>{t('form.icon')}</Text>
        <IconPickerRow
          selected={icon}
          onSelect={setIcon}
          accentColor={color}
          colorScheme={colorScheme}
        />

        {categories.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.textColor }]}>
              {t('form.categories')}
            </Text>
            <View style={styles.chipWrap}>
              {categories.map((cat) => (
                <Chip
                  key={cat.id}
                  label={`${cat.icon} ${cat.name}`}
                  selected={categoryIds.includes(cat.id)}
                  onPress={() => toggleCategory(cat.id)}
                />
              ))}
            </View>
          </>
        )}

        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: colors.textColor }]}>{t('form.hidden')}</Text>
          <Switch value={isHidden} onValueChange={setIsHidden} />
        </View>

        {displayError && <Text style={styles.error}>{displayError}</Text>}

        <Button
          label={isEdit ? t('form.save') : t('form.create')}
          onPress={save}
          loading={saving}
        />

        {isEdit && (
          <Button
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
