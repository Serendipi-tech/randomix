import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type DividerProps = {
  label?: string;
};

/** Separatore orizzontale: linea piena `colors.border`. Con `label`, testo centrato tra due segmenti. */
export function Divider({ label }: DividerProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  if (!label) {
    return <View style={[styles.line, { backgroundColor: colors.border }]} />;
  }

  return (
    <View style={styles.row}>
      <View style={[styles.line, styles.flex, { backgroundColor: colors.border }]} />
      <Text style={[styles.label, { color: colors.textColor }]}>{label}</Text>
      <View style={[styles.line, styles.flex, { backgroundColor: colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  line: {
    height: 1,
  },
  flex: {
    flex: 1,
  },
  label: {
    fontSize: 14,
  },
});
