import { StyleSheet, Text, View } from 'react-native';
import { hexToRgba } from '@/utils/color';

type BadgeProps = {
  label: string;
  color: string;
};

/** Badge non interattivo: testo/bordo nel colore passato, sfondo nella stessa tinta al 20%. */
export function Badge({ label, color }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: hexToRgba(color, 0.2), borderColor: color }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
