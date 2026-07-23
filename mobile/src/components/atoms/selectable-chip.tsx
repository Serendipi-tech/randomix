import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';

interface SelectableChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  colorScheme: 'light' | 'dark';
}

/** Chip selezionabile per scelte a opzioni (categorie, status). */
export function SelectableChip({ label, selected, onPress, colorScheme }: SelectableChipProps) {
  const colors = Colors[colorScheme];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: selected ? hexToRgba(colors.primary, 0.18) : colors.backgroundElement },
        selected && styles.selected,
      ]}>
      <Text style={[styles.label, { color: selected ? colors.primary : colors.textSecondary }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: Colors.light.primary,
  },
  label: {
    fontSize: 14,
  },
});
