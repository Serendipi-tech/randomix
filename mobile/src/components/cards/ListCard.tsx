import type { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { CardShell } from '@/components/cards/CardShell';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

const LIST_CARD_HEIGHT = 66;

type ListCardProps = {
  title: string;
  category?: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  /** Emoji della lista (scelta in creazione): se presente sostituisce l'icona di fallback. */
  emoji?: string;
  color: string;
  itemsCount?: number;
  maxItems?: number;
  onPress: () => void;
};

/** Card lista: emoji della lista (o icona gigante ruotata di fallback) a riempimento dell'area sinistra,
 *  gradient di sfondo transparent -> color, titolo/categoria e conteggio. Bordo colorato dal `color`; card interamente cliccabile. */
export function ListCard({ title, category, icon: Icon, emoji, color, itemsCount, maxItems, onPress }: ListCardProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <CardShell borderColor={color} onPress={onPress}>
      {/* Margine negativo per annullare il padding del guscio e ottenere il layout full-bleed */}
      <View style={styles.fullBleed}>
        <LinearGradient
          colors={['transparent', hexToRgba(color, 0.25)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.iconArea}>
          {emoji ? (
            <Text style={[styles.emoji, { color }]} numberOfLines={1} adjustsFontSizeToFit>
              {emoji}
            </Text>
          ) : (
            <View style={styles.iconRotation}>
              <Icon size={LIST_CARD_HEIGHT * 1.15} color={color} />
            </View>
          )}
        </View>
        <View style={styles.content}>
          <View style={styles.contentRow}>
            <View style={styles.textBlock}>
              {category && <Text style={[styles.category, { color: colors.textColor }]}>{category}</Text>}
              <Text style={[styles.title, { color: colors.textColor }]}>{title}</Text>
            </View>
            <View style={styles.trailing}>
              {itemsCount !== undefined && maxItems !== undefined && (
                <Text style={[styles.count, { color: colors.textColor }]}>
                  {itemsCount}/{maxItems}
                </Text>
              )}
              <View style={[styles.arrow, { backgroundColor: colors.foreground }]}>
                <ChevronRight size={18} color={color} />
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
    gap: 12,
    overflow: 'hidden',
  },
  iconArea: {
    width: LIST_CARD_HEIGHT,
    height: LIST_CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRotation: { transform: [{ rotate: '-30deg' }], opacity: 0.5 },
  emoji: { fontSize: 40, maxWidth: LIST_CARD_HEIGHT, fontWeight: '700', textAlign: 'center' },
  content: { flex: 1, paddingTop: 16, paddingBottom: 16, paddingLeft: 5, paddingRight: 16 },
  contentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  textBlock: { flex: 1, gap: 2, marginTop: -3 },
  category: { fontSize: 12, lineHeight: 14, opacity: 0.7 },
  title: { fontWeight: '700', fontSize: 16, lineHeight: 18 },
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
