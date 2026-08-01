import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type StatusBadgeProps = {
  label: string;
  color: string;
};

/** Badge di stato: pallino colorato + etichetta. Il colore è già risolto dal chiamante, il testo deriva dal tema. */
export function StatusBadge({ label, color }: StatusBadgeProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: color, borderColor: color }]} />
      <Text style={[styles.label, { color: colors.textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
});
