import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { SkeletonLine } from '@/components/atoms/SkeletonLine';

interface ListCardSkeletonProps {
  colorScheme: 'light' | 'dark';
}

// Stessa geometria di ListCard: altezza, slot icona e raggio devono coincidere, altrimenti allo
// scambio skeleton → contenuto la lista sobbalza
const CARD_HEIGHT = 50;
const CARD_RADIUS = 12;
const ICON_SLOT_WIDTH = 56;
const ICON_SIZE = 32;

/** Placeholder di caricamento con la stessa sagoma di ListCard. */
export function ListCardSkeleton({ colorScheme }: ListCardSkeletonProps) {
  const colors = Colors[colorScheme];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.foreground, borderColor: hexToRgba(colors.border, 0.5) },
      ]}
    >
      <View style={styles.iconArea}>
        <SkeletonLine width={ICON_SIZE} height={ICON_SIZE} radius={ICON_SIZE / 2} />
      </View>
      <View style={styles.textZone}>
        <SkeletonLine width="30%" height={9} />
        <SkeletonLine width="60%" height={13} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: CARD_RADIUS,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  iconArea: {
    width: ICON_SLOT_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textZone: {
    flex: 1,
    gap: 5,
    paddingRight: 16,
  },
});
