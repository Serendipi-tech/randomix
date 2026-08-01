import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type ChipProps = {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
};

/** Chip selezionabile: sfondo/bordo pieni sul primary quando attivo, outline quando inattivo. */
export function Chip({ label, selected, disabled = false, onPress }: ChipProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : 'transparent',
          borderColor: selected ? colors.primary : colors.border,
          opacity: disabled ? 0.4 : 1,
        },
        pressed && !disabled ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.label, { color: colors.textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
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
