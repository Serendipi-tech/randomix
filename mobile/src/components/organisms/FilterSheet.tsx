import { useEffect, useMemo, useState } from 'react';
import { Keyboard, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { Input } from '@/components/molecules/Input';
import { Checkbox } from '@/components/atoms/Checkbox';

/** Gruppo di opzioni filtrabili: `label` è l'intestazione di sezione, `options` le voci selezionabili. */
export type FilterGroup = { label: string; options: Array<{ label: string; value: string }> };

type FilterSheetProps = {
  groups: FilterGroup[];
  selected: string[];
  visible: boolean;
  onClose: () => void;
  onToggle: (value: string) => void;
};

/** Bottomsheet di filtri: ricerca testuale + liste di checkbox per gruppo. La shell (slide/backdrop/handle)
 *  è delegata a `BottomSheet`; ricerca, filtro e gestione tastiera sono interni. */
export function FilterSheet({ groups, selected, visible, onClose, onToggle }: FilterSheetProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const [search, setSearch] = useState('');

  // Alla chiusura chiudo la tastiera e azzero la ricerca per il prossimo apertura
  useEffect(() => {
    if (!visible) {
      Keyboard.dismiss();
      setSearch('');
    }
  }, [visible]);

  // Filtro le opzioni sul testo di ricerca e scarto i gruppi rimasti vuoti
  const filteredGroups = useMemo(() => {
    const query = search.toLowerCase();
    return groups
      .map((group) => ({ ...group, options: group.options.filter((opt) => opt.label.toLowerCase().includes(query)) }))
      .filter((group) => group.options.length > 0);
  }, [groups, search]);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textColor }]}>Filtri</Text>
      </View>
      <View style={styles.searchWrap}>
        <Input variant="text" value={search} onChangeText={setSearch} placeholder="Cerca..." />
      </View>
      <ScrollView
        style={[styles.list, Platform.OS === 'web' ? ({ scrollbarWidth: 'none' } as object) : null]}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filteredGroups.length === 0 && <Text style={[styles.empty, { color: colors.disabled }]}>Nessun risultato</Text>}
        {filteredGroups.map((group) => (
          <View key={group.label}>
            <Text style={[styles.sectionLabel, { color: colors.textColor }]}>{group.label}</Text>
            {group.options.map((opt) => (
              <Checkbox key={opt.value} checked={selected.includes(opt.value)} onPress={() => onToggle(opt.value)} label={opt.label} />
            ))}
          </View>
        ))}
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingBottom: 20,
  },
  empty: {
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionLabel: {
    opacity: 0.55,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
});
