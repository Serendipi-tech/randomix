import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { resolveListIcon } from '@/constants/list-icons';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { Input } from '@/components/molecules/Input';
import { OptionRow } from '@/components/molecules/OptionRow';
import type { ListCategory } from '@/utils/useListCategories';

type ListCategoryPickerSheetProps = {
  visible: boolean;
  onClose: () => void;
  categories: ListCategory[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchPlaceholder: string;
  emptyLabel: string;
};

/** Bottomsheet di scelta della macro-categoria (single-select): per ogni voce mostra icona, nome
 *  e tutte le item-categories contenute, così si capisce cosa c'è dentro. Dumb: dati dall'esterno. */
export function ListCategoryPickerSheet({
  visible,
  onClose,
  categories,
  selectedId,
  onSelect,
  searchPlaceholder,
  emptyLabel,
}: ListCategoryPickerSheetProps) {
  const { t } = useTranslation('lists');
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(query));
  }, [categories, search]);

  const previewOf = (included: string[]) => included.map((c) => t(`categories.${c}`)).join(' · ');

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Input variant="text" value={search} onChangeText={setSearch} placeholder={searchPlaceholder} style={styles.search} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <Text style={[styles.empty, { color: colors.disabled }]}>{emptyLabel}</Text>
        ) : (
          filtered.map((cat) => (
            <OptionRow
              key={cat.id}
              icon={resolveListIcon(cat.icon)}
              title={cat.name}
              subtitle={previewOf(cat.includedCategories)}
              active={selectedId === cat.id}
              onPress={() => {
                onSelect(cat.id);
                onClose();
              }}
            />
          ))
        )}
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  search: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 4,
  },
  empty: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 24,
  },
});
