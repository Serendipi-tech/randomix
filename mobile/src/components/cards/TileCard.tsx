import type { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { CardShell } from '@/components/cards/CardShell';

const DEFAULT_HEIGHT = 96;
// Padding del CardShell, annullato col margine negativo per ottenere il layout full-bleed
const SHELL_PADDING = 16;
// L'icona ruotata deve coprire la card fino ai bordi: il resto viene tagliato
const ICON_SIZE_RATIO = 1.9;

type TileCardProps = {
  icon: ComponentType<{ size?: number; color?: string }>;
  label: string;
  /** Tinta della tile: bordo, gradiente di sfondo e icona. */
  color: string;
  /** Senza `onPress` la tile non è premibile. */
  onPress?: () => void;
  height?: number;
};

/** Tile quadrotta: icona gigante ruotata come sfondo (stesso trattamento di ListCard) e solo il
 *  nome al centro. Puro render da props: nessuna logica, nessuna traduzione. */
export function TileCard({ icon: Icon, label, color, onPress, height = DEFAULT_HEIGHT }: TileCardProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <CardShell borderColor={color} onPress={onPress}>
      <View style={[styles.fullBleed, { height }]}>
        <LinearGradient
          colors={['transparent', hexToRgba(color, 0.25)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.iconLayer} pointerEvents="none">
          <Icon size={height * ICON_SIZE_RATIO} color={color} />
        </View>

        <Text style={[styles.label, { color: colors.textColor }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </CardShell>
  );
}

const styles = StyleSheet.create({
  fullBleed: {
    margin: -SHELL_PADDING,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  // Icona come texture di sfondo: ruotata e attenuata, non deve competere col nome
  iconLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-30deg' }],
    opacity: 0.35,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
