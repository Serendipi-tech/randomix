import { Pressable, StyleSheet, Text } from 'react-native';
import { Pencil } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type CustomFacesChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

/** Variante del Chip solo per il valore "facce custom": bordo tratteggiato (diventa continuo da
 *  selezionato) e matita sempre visibile, per segnalare che resta modificabile anche dopo la scelta.
 *  Non è il Chip condiviso: quello non supporta icona/bordo tratteggiato e non va toccato per un
 *  caso d'uso singolo. */
export function CustomFacesChip({ label, selected, onPress }: CustomFacesChipProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : 'transparent',
          borderColor: selected ? colors.primary : colors.border,
          borderStyle: selected ? 'solid' : 'dashed',
        },
        pressed ? styles.pressed : null,
      ]}
    >
      <Pencil size={11} color={colors.textColor} />
      <Text style={[styles.label, { color: colors.textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
