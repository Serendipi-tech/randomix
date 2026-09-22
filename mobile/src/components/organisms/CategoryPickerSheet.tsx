import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { LayoutGrid } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { Input } from '@/components/molecules/Input';
import { OptionRow } from '@/components/molecules/OptionRow';
import type { Category } from '@/utils/useListCategories';

export type CategoryOption = { value: Category; label: string };

// Sotto questa soglia la ricerca è superflua: poche opzioni si scorrono a colpo d'occhio
const SEARCH_MIN_OPTIONS = 10;

type CategoryPickerSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** Opzioni selezionabili (valore + label già tradotta), passate dall'esterno. */
  options: CategoryOption[];
  selected: Category | null;
  onSelect: (value: Category) => void;
  searchPlaceholder: string;
  /** Messaggio mostrato quando non ci sono opzioni. */
  emptyLabel: string;
};

/** Bottomsheet di scelta categoria: dumb, elenca le opzioni ricevute e segnala la selezione.
 *  Stessa struttura (ricerca + OptionRow) di ListCategoryPickerSheet, per coerenza visiva. */
export function CategoryPickerSheet({
  visible,
  onClose,
  options,
  selected,
  onSelect,
  searchPlaceholder,
  emptyLabel,
}: CategoryPickerSheetProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter((o) => o.label.toLowerCase().includes(query));
  }, [options, search]);

  const showSearch = options.length >= SEARCH_MIN_OPTIONS;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      {showSearch && (
        <Input variant="text" value={search} onChangeText={setSearch} placeholder={searchPlaceholder} style={styles.search} />
      )}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <Text style={[styles.empty, { color: colors.disabled }]}>{emptyLabel}</Text>
        ) : (
          filtered.map((option) => (
            <OptionRow
              key={option.value}
              icon={LayoutGrid}
              title={option.label}
              active={selected === option.value}
              onPress={() => {
                onSelect(option.value);
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
