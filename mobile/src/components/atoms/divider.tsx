import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';

type DividerProps = {
  label: string;
  colorScheme: 'light' | 'dark';
};

/** Separatore orizzontale riusabile con etichetta centrale (es. "oppure") tra due gruppi di azioni. */
export function Divider({ label, colorScheme }: DividerProps) {
  const colors = Colors[colorScheme];
  const fill = hexToRgba(colorScheme === 'light' ? colors.titleColor : colors.border, colorScheme === 'light' ? 0.06 : 0.08);

  return (
    <View style={styles.divider}>
      <View style={[styles.line, { backgroundColor: fill }]} />
      <Text style={[styles.label, { color: colors.placeholder }]}>{label}</Text>
      <View style={[styles.line, { backgroundColor: fill }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  line: {
    flex: 1,
    height: 2,
  },
  label: {
    fontSize: 14,
  },
});
