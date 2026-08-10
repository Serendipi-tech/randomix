import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { List, Pencil } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { DEFAULT_LIST_ICON_KEY, resolveListIcon } from '@/constants/list-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/atoms/Button';
import { Switch } from '@/components/atoms/Switch';
import { Input } from '@/components/molecules/Input';
import { PageHeader } from '@/components/molecules/PageHeader';
import { Chip } from '@/components/atoms/Chip';
import { ConfirmSheet } from '@/components/molecules/confirm-sheet';
import { IconPickerSheet } from '@/components/organisms/IconPickerSheet';
import { ColorPickerSheet } from '@/components/organisms/ColorPickerSheet';
import { ListCard } from '@/components/cards/ListCard';
import { useListCategories } from '@/utils/useListCategories';
import { useListDetail } from '@/utils/useListDetail';
import { useListMutations } from '@/utils/useListMutations';

const NAME_MAX_LENGTH = 20;
const DESCRIPTION_MAX_LENGTH = 225;

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
  const listColors = Object.values(colors.extraColors);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState<string>(DEFAULT_LIST_ICON_KEY);
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<string>(listColors[0]);
  const [isHidden, setIsHidden] = useState(false);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
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
    if (!name.trim()) {
      setLocalError(t('form.missingFields'));
      return;
    }
    if (name.trim().length > NAME_MAX_LENGTH) {
      setLocalError(t('form.nameTooLong', { max: NAME_MAX_LENGTH }));
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
    router.replace('/(app)/(tabs)/(home)');
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
          label={t('form.name')}
          required
          placeholder={t('form.namePlaceholder')}
          value={name}
          onChangeText={setName}
          maxLength={NAME_MAX_LENGTH}
        />
        <Input
          label={t('form.description')}
          placeholder={t('form.descriptionPlaceholder')}
          value={description}
          onChangeText={setDescription}
          variant="textarea"
          maxLength={DESCRIPTION_MAX_LENGTH}
        />

        {/* Anteprima non cliccabile di come apparirà la card lista, con controlli per modificare icona/colore */}
        <View pointerEvents="none">
          <ListCard
            title={name || t('form.namePlaceholder')}
            icon={resolveListIcon(icon)}
            color={color}
            itemsCount={0}
          />
        </View>
        <View style={styles.appearanceControls}>
          <Button variant="soft" icon={Pencil} label={t('form.editIcon')} onPress={() => setShowIconPicker(true)} />
          <Button variant="soft" swatchColor={color} label={t('form.editColor')} onPress={() => setShowColorPicker(true)} />
        </View>

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
          <Switch value={isHidden} onChange={setIsHidden} />
        </View>

        {displayError && <Text style={styles.error}>{displayError}</Text>}

        <Button
          label={isEdit ? t('form.save') : t('form.create')}
          onPress={save}
          loading={saving}
        />

        {isEdit && (
          <View style={styles.deleteZone}>
            <Button
              variant="secondary"
              label={t('form.delete')}
              onPress={() => setShowDeleteConfirm(true)}
              loading={deleting}
            />
          </View>
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

      <IconPickerSheet
        visible={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        selected={icon}
        onSelect={setIcon}
      />

      <ColorPickerSheet
        visible={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        colors={listColors}
        selected={color}
        onSelect={setColor}
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
  sectionLabel: {
    fontSize: 16,
  },
  appearanceControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  deleteZone: {
    marginTop: Spacing.four,
  },
  error: {
    fontSize: 14,
    color: Colors.light.error,
    textAlign: 'center',
  },
});
