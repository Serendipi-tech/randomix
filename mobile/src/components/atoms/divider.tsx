import { StyleSheet, Text, View } from 'react-native';
import { InputSurface } from '@/constants/theme';

type DividerProps = {
  label: string;
  colorScheme: 'light' | 'dark';
};

/** Separatore orizzontale riusabile con etichetta centrale (es. "oppure") tra due gruppi di azioni. */
export function Divider({ label, colorScheme }: DividerProps) {
  const surface = InputSurface[colorScheme];

  return (
    <View style={styles.divider}>
      <View style={[styles.line, { backgroundColor: surface.fill }]} />
      <Text style={[styles.label, { color: surface.placeholder }]}>{label}</Text>
      <View style={[styles.line, { backgroundColor: surface.fill }]} />
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
