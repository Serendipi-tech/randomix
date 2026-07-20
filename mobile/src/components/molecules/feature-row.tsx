import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import { CardSurface } from '@/constants/theme';

type FeatureRowProps = {
  Icon: LucideIcon;
  tint: string;
  gradient: readonly [string, string];
  title: string;
  subtitle: string;
  colorScheme: 'light' | 'dark';
};

/** Riga riusabile icona-a-sx/testo-a-dx: icon-chip con gradiente soft + titolo/sottotitolo, superficie tinta leggera. */
export function FeatureRow({ Icon, tint, gradient, title, subtitle, colorScheme }: FeatureRowProps) {
  const textColor = CardSurface[colorScheme].text;
  const subtitleColor = colorScheme === 'light' ? 'rgba(36,26,61,0.68)' : 'rgba(243,236,255,0.7)';

  return (
    <View style={[styles.row, { backgroundColor: `${tint}1F` }]}>
      {/* shadowWrapper (ombra) + clip (overflow per il gradiente) separati: sullo stesso elemento sfocano il testo su web */}
      <View style={styles.iconShadowWrapper}>
        <View style={styles.iconClip}>
          <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          {/* l'SVG dell'icona non è "positioned" come le View su web: senza questo, il gradiente
              assoluto dipinge sempre sopra di lui a prescindere dall'ordine nel JSX */}
          <View style={styles.iconStack}>
            <Icon size={22} color="#fff" strokeWidth={2.5} />
          </View>
        </View>
      </View>
      <View style={styles.rowTextZone}>
        <Text style={[styles.rowTitle, { color: textColor }]}>{title}</Text>
        <Text style={[styles.rowSubtitle, { color: subtitleColor }]}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    padding: 10,
  },
  iconShadowWrapper: {
    borderRadius: 15,
    boxShadow: '0px 3px 6px rgba(0,0,0,0.18)',
  },
  iconClip: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconStack: {
    position: 'relative',
    zIndex: 1,
  },
  rowTextZone: {
    flex: 1,
    gap: 1,
  },
  rowTitle: {
    fontSize: 16,
  },
  rowSubtitle: {
    fontSize: 13,
    lineHeight: 17,
  },
});
