import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { List, Pencil } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { DEFAULT_LIST_ICON_KEY, resolveListIcon } from '@/constants/list-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { Button } from '@/components/atoms/Button';
import { Switch } from '@/components/atoms/Switch';
import { Input } from '@/components/molecules/Input';
import { PageHeader } from '@/components/molecules/PageHeader';
import { ConfirmSheet } from '@/components/molecules/confirm-sheet';
import { IconPickerSheet } from '@/components/organisms/IconPickerSheet';
import { ColorPickerSheet } from '@/components/organisms/ColorPickerSheet';
import { ListCategoryPickerSheet } from '@/components/organisms/ListCategoryPickerSheet';
import { ListCard } from '@/components/cards/ListCard';
import { useListCategories } from '@/utils/useListCategories';
import { useListDetail } from '@/utils/useListDetail';
import { useListMutations } from '@/utils/useListMutations';

const NAME_MAX_LENGTH = 20;
const DESCRIPTION_MAX_LENGTH = 100;

export default function ListFormScreen() {
  const { t } = useTranslation('lists');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);

  const { list } = useListDetail(id);
  const { categories, loading: categoriesLoading } = useListCategories();
  const { createList, updateList, deleteList, saving, deleting, error } = useListMutations();
  const listColors = Object.values(colors.extraColors);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState<string>(DEFAULT_LIST_ICON_KEY);
  // true se l'utente ha scelto un'icona a mano: in tal caso la categoria non la sovrascrive più
  const [iconTouched, setIconTouched] = useState(false);
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<string>(listColors[0]);
  const [isHidden, setIsHidden] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) ?? null;
  // Stato neutro dello slot category: solo se sto caricando e non ho ancora dati (con la cache non appare)
  const isCategoriesLoading = categoriesLoading && categories.length === 0;

  // precompilo il form quando arrivano i dati della lista in modifica
  useEffect(() => {
    if (!isEdit || !list) return;
    setName(list.name);
    setIcon(list.icon);
    setDescription(list.description ?? '');
    setColor(list.color);
    setIsHidden(list.isHidden);
    setSelectedCategoryId(list.categories[0]?.id ?? null);
    // in modifica l'icona esistente è "voluta": la categoria non la sovrascrive
    setIconTouched(true);
  }, [isEdit, list]);

  // Sceglie la categoria e, se l'utente non ha ancora scelto un'icona a mano, la inizializza con quella della categoria
  const selectCategory = (id: string) => {
    setSelectedCategoryId(id);
    if (iconTouched) return;
    const cat = categories.find((c) => c.id === id);
    if (cat) setIcon(cat.icon);
  };

  // Icona scelta a mano dall'utente: da ora la categoria non la tocca più
  const selectIcon = (name: string) => {
    setIcon(name);
    setIconTouched(true);
  };

  const save = async () => {
    setLocalError(null);
    if (!name.trim()) {
      setLocalError(t('form.nameRequired'));
      return;
    }
    if (name.trim().length > NAME_MAX_LENGTH) {
      setLocalError(t('form.nameTooLong', { max: NAME_MAX_LENGTH }));
      return;
    }
    if (!selectedCategoryId) {
      setLocalError(t('form.categoryRequired'));
      return;
    }
    if (description.length > DESCRIPTION_MAX_LENGTH) {
      setLocalError(t('form.descriptionTooLong', { max: DESCRIPTION_MAX_LENGTH }));
      return;
    }
    const input = {
      name: name.trim(),
      icon,
      color,
      description: description.trim() || null,
      isHidden,
      categoryIds: selectedCategoryId ? [selectedCategoryId] : [],
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
    router.replace('/(app)/(tabs)/(home)');
  };

  const displayError = localError ?? error?.message ?? null;

  return (
    <SafeAreaView style={styles.safe}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader
        icon={List}
        title={isEdit ? t('form.titleEdit') : t('form.titleCreate')}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Anteprima in cima: si aggiorna mentre modifichi nome/icona/colore/categoria */}
        <View pointerEvents="none">
          <ListCard
            title={name || t('form.namePlaceholder')}
            category={selectedCategory?.name}
            icon={resolveListIcon(icon)}
            color={color}
            itemsCount={0}
            isHidden={isHidden}
          />
        </View>

        <Input
          label={t('form.name')}
          required
          placeholder={t('form.namePlaceholder')}
          value={name}
          onChangeText={setName}
          maxLength={NAME_MAX_LENGTH}
        />

        {/* Slot sempre presente (layout fisso, niente pop-in): finché le categorie caricano resta neutro/disabilitato */}
        <View>
          <Text style={[styles.fieldLabel, { color: colors.textColor }]}>
            {t('form.categories')}
            <Text style={{ color: colors.error }}> *</Text>
          </Text>
          <Button
            variant="soft"
            icon={selectedCategory ? resolveListIcon(selectedCategory.icon) : undefined}
            label={
              isCategoriesLoading
                ? t('form.categoryLoading')
                : selectedCategory
                  ? selectedCategory.name
                  : t('form.categoryPlaceholder')
            }
            onPress={() => setShowCategoryPicker(true)}
            disabled={isCategoriesLoading}
          />
        </View>

        <View>
          <Text style={[styles.fieldLabel, { color: colors.textColor }]}>{t('form.appearance')}</Text>
          <View style={styles.appearanceControls}>
            <View style={styles.appearanceItem}>
              <Button variant="soft" icon={Pencil} label={t('form.editIcon')} onPress={() => setShowIconPicker(true)} />
            </View>
            <View style={styles.appearanceItem}>
              <Button variant="soft" swatchColor={color} label={t('form.editColor')} onPress={() => setShowColorPicker(true)} />
            </View>
          </View>
        </View>

        <Input
          label={t('form.description')}
          placeholder={t('form.descriptionPlaceholder')}
          value={description}
          onChangeText={setDescription}
          variant="textarea"
          textareaMinHeight={48}
          maxLength={DESCRIPTION_MAX_LENGTH}
        />

        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: colors.textColor }]}>{t('form.hidden')}</Text>
          <Switch value={isHidden} onChange={setIsHidden} />
        </View>

        {displayError && <Text style={styles.error}>{displayError}</Text>}
      </ScrollView>

      {/* Azioni fisse in fondo alla pagina */}
      <View style={styles.footer}>
        <View style={styles.actionItem}>
          {isEdit ? (
            <Button
              variant="destructive"
              label={t('form.delete')}
              onPress={() => setShowDeleteConfirm(true)}
              loading={deleting}
            />
          ) : (
            <Button variant="secondary" label={t('form.cancel')} onPress={() => router.back()} />
          )}
        </View>
        <View style={styles.actionItem}>
          <Button
            variant="primary"
            label={isEdit ? t('form.save') : t('form.create')}
            onPress={save}
            loading={saving}
          />
        </View>
      </View>

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

      <IconPickerSheet
        visible={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        selected={icon}
        onSelect={selectIcon}
      />

      <ColorPickerSheet
        visible={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        colors={listColors}
        selected={color}
        onSelect={setColor}
      />

      <ListCategoryPickerSheet
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        categories={categories}
        selectedId={selectedCategoryId}
        onSelect={selectCategory}
        searchPlaceholder={t('form.categorySearch')}
        emptyLabel={t('form.categoryEmpty')}
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
    paddingTop: 0,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  appearanceControls: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  appearanceItem: {
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 16,
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
  error: {
    fontSize: 14,
    color: Colors.light.error,
    textAlign: 'center',
  },
});
