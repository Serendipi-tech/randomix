import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba, isLightColor } from '@/utils/color';

// Inchiostro dello sfondo pieno: dipende dalla tinta del badge, non dal tema, quindi i due token
// vengono presi fissi (lo scuro e il chiaro della palette) invece che dallo schema attivo
const DARK_INK = Colors.dark.background;
const LIGHT_INK = Colors.dark.textColor;

type BadgeProps = {
  label: string;
  color: string;
  /** Sfondo pieno nel colore passato invece della tinta trasparente; il testo si adatta. */
  solid?: boolean;
};

/** Badge non interattivo: testo/bordo nel colore passato, sfondo nella stessa tinta al 20%
 *  (`solid`: sfondo pieno e testo in contrasto). */
export function Badge({ label, color, solid = false }: BadgeProps) {
  const background = solid ? color : hexToRgba(color, 0.2);
  const ink = solid ? (isLightColor(color) ? DARK_INK : LIGHT_INK) : color;

  return (
    <View style={[styles.badge, { backgroundColor: background, borderColor: color }]}>
      <Text style={[styles.label, { color: ink }]}>{label}</Text>
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
