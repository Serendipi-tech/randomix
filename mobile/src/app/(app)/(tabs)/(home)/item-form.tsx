import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/molecules/Input';
import { PageHeader } from '@/components/molecules/PageHeader';
import { CategoryPickerSheet, type CategoryOption } from '@/components/organisms/CategoryPickerSheet';
import { useItemMutations } from '@/utils/useItemMutations';
import { useListCategories, type Category } from '@/utils/useListCategories';
import { useListDetail } from '@/utils/useListDetail';

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

  const { addItemToList, saving, error } = useItemMutations();
  const { list } = useListDetail(params.listId);
  const { categories: allMacroCategories } = useListCategories();

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

  const save = async () => {
    setLocalError(null);
    if (!name.trim() || !category || !params.listId) {
      setLocalError(t('itemForm.missingFields'));
      return;
    }
    try {
      await addItemToList({
        listId: params.listId,
        name: name.trim(),
        category,
        description: description.trim() || null,
      });
      router.back();
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  const displayError = localError ?? error?.message ?? null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
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

        {displayError && <Text style={styles.error}>{displayError}</Text>}

        <Button label={t('itemForm.add')} onPress={save} loading={saving} />
      </ScrollView>

      <CategoryPickerSheet
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        options={categoryOptions}
        selected={category}
        onSelect={setCategory}
        emptyLabel={t('itemForm.noCategories')}
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
});
