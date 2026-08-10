import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import type { Category } from '@/utils/useListCategories';

export type CategoryOption = { value: Category; label: string };

type CategoryPickerSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** Opzioni selezionabili (valore + label già tradotta), passate dall'esterno. */
  options: CategoryOption[];
  selected: Category | null;
  onSelect: (value: Category) => void;
  /** Messaggio mostrato quando non ci sono opzioni. */
  emptyLabel: string;
};

/** Bottomsheet di scelta categoria: dumb, elenca le opzioni ricevute e segnala la selezione. */
export function CategoryPickerSheet({ visible, onClose, options, selected, onSelect, emptyLabel }: CategoryPickerSheetProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {options.length === 0 ? (
          <Text style={[styles.empty, { color: colors.disabled }]}>{emptyLabel}</Text>
        ) : (
          options.map((option) => {
            const isSelected = selected === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
                style={[styles.row, isSelected && { backgroundColor: hexToRgba(colors.primary, 0.12) }]}
              >
                <Text style={[styles.label, { color: colors.textColor }]}>{option.label}</Text>
                {isSelected && <Check size={18} color={colors.primary} />}
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
  },
  empty: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 24,
  },
});
