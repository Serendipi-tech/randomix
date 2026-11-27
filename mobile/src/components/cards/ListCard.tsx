import type { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Lock } from 'lucide-react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { DiagonalStripes } from '@/components/atoms/DiagonalStripes';
import { CardShell } from '@/components/cards/CardShell';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

const LIST_CARD_HEIGHT = 50;
const ICON_SLOT_WIDTH = 56;
const ICON_SIZE = 32;
const ICON_BACKDROP_SIZE = 50;

type ListCardProps = {
  title: string;
  category?: string;
  icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  /** Emoji della lista (scelta in creazione): se presente sostituisce l'icona di fallback. */
  emoji?: string;
  color: string;
  /** Numero di elementi nella lista: sempre visibile, "0" se vuota, "N/N" altrimenti. */
  itemsCount: number;
  /** Lista nascosta agli amici: mostra un lucchetto accanto al titolo. */
  isHidden?: boolean;
  /** Se assente la card non è cliccabile (es. anteprima in sola lettura). */
  onPress?: () => void;
};

/** Card lista: emoji della lista (o icona di fallback) nello slot a sinistra su righe diagonali, senza riquadro di sfondo,
 *  gradient di sfondo transparent -> color, titolo/categoria e conteggio. Bordo colorato dal `color`; card interamente cliccabile. */
export function ListCard({ title, category, icon: Icon, emoji, color, itemsCount, isHidden, onPress }: ListCardProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <CardShell borderColor={color} borderWidth={1.5} onPress={onPress}>
      {/* Margine negativo per annullare il padding del guscio e ottenere il layout full-bleed */}
      <View style={styles.fullBleed}>
        <LinearGradient
          colors={['transparent', hexToRgba(color, 0.25)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.iconArea}>
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <DiagonalStripes width={ICON_SLOT_WIDTH} height={LIST_CARD_HEIGHT} color={color} />
          </View>
          {emoji ? (
            <Text style={[styles.emoji, { color, textShadowColor: colors.shadow }]} numberOfLines={1} adjustsFontSizeToFit>
              {emoji}
            </Text>
          ) : (
            <View style={styles.iconStack}>
              {/* Backdrop: glow radiale dietro l'icona nel capo sinistro del gradiente della card, cioè
                  `foreground` (lì il gradiente è trasparente). La shadow sulla View non va: su Android
                  l'elevation segue il rettangolo della View, non la forma dell'SVG dell'icona */}
              <Svg width={ICON_BACKDROP_SIZE} height={ICON_BACKDROP_SIZE} style={styles.iconBackdrop} pointerEvents="none">
                <Defs>
                  <RadialGradient id="listIconBackdrop" cx="50%" cy="50%" r="50%">
                    <Stop offset="0%" stopColor={colors.foreground} stopOpacity={0.72} />
                    <Stop offset="25%" stopColor={colors.foreground} stopOpacity={0.6} />
                    <Stop offset="50%" stopColor={colors.foreground} stopOpacity={0.38} />
                    <Stop offset="75%" stopColor={colors.foreground} stopOpacity={0.16} />
                    <Stop offset="100%" stopColor={colors.foreground} stopOpacity={0} />
                  </RadialGradient>
                </Defs>
                <Circle
                  cx={ICON_BACKDROP_SIZE / 2}
                  cy={ICON_BACKDROP_SIZE / 2}
                  r={ICON_BACKDROP_SIZE / 2}
                  fill="url(#listIconBackdrop)"
                />
              </Svg>
              {/* zIndex: senza, su Android il backdrop absolute coprirebbe l'icona */}
              <View style={styles.iconGlyph}>
                <Icon size={ICON_SIZE} color={color} />
              </View>
            </View>
          )}
        </View>
        <View style={styles.content}>
          <View style={styles.contentRow}>
            <View style={styles.textBlock}>
              {(category || isHidden) && (
                <View style={styles.categoryRow}>
                  {category && <Text style={[styles.category, { color: colors.textColor }]}>{category}</Text>}
                  {/* Lucchetto lista nascosta: in coda alla riga categoria, stesso formato caption */}
                  {isHidden && <Lock size={12} color={colors.textColor} strokeWidth={2.3} />}
                </View>
              )}
              <Text style={[styles.title, { color: colors.textColor }]} numberOfLines={1}>{title}</Text>
            </View>
            <View style={styles.trailing}>
              <Text style={[styles.count, { color: colors.textColor }]}>
                {itemsCount === 0 ? '0' : `${itemsCount}/${itemsCount}`}
              </Text>
              <View style={[styles.arrow, { backgroundColor: colors.foreground }]}>
                <ChevronRight size={18} color={color} strokeWidth={2.5} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </CardShell>
  );
}

const styles = StyleSheet.create({
  fullBleed: {
    margin: -16,
    height: LIST_CARD_HEIGHT,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 0,
    overflow: 'hidden',
  },
  iconArea: {
    width: ICON_SLOT_WIDTH,
    height: LIST_CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStack: { width: ICON_SIZE, height: ICON_SIZE, alignItems: 'center', justifyContent: 'center' },
  // Glow centrato sull'icona e più largo di essa, quindi sborda dallo stack
  iconGlyph: { zIndex: 2 },
  iconBackdrop: {
    zIndex: 1,
    position: 'absolute',
    left: (ICON_SIZE - ICON_BACKDROP_SIZE) / 2,
    top: (ICON_SIZE - ICON_BACKDROP_SIZE) / 2,
  },
  emoji: { textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 4, fontSize: ICON_SIZE, maxWidth: ICON_SLOT_WIDTH, fontWeight: '700', textAlign: 'center' },
  // Nessun padding verticale: categoria + titolo (31px) supererebbero i 50px di card e il blocco risulterebbe disassato
  content: { flex: 1, justifyContent: 'center', paddingLeft: 2, paddingRight: 16 },
  contentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  // marginBottom: compensazione ottica, il descender della 'p' sborda sotto il line box e il blocco sembra basso
  textBlock: { flex: 1, gap: 0, marginBottom: 4 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 4, opacity: 0.7 },
  category: { fontSize: 11, lineHeight: 13, textTransform: 'uppercase', letterSpacing: 0.5 },
  title: { flexShrink: 1, fontWeight: '600', fontSize: 16, lineHeight: 18 },
  trailing: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  count: { fontSize: 13, lineHeight: 16, fontWeight: '600', opacity: 0.7 },
  arrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
