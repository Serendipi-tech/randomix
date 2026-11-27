import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { SkeletonLine } from '@/components/atoms/SkeletonLine';

// Stessa geometria di NotificationCard: raggio, barra d'accento, tile icona e padding devono
// coincidere, altrimenti allo scambio il feed sobbalza
const CARD_RADIUS = 16;
const STRIPE_WIDTH = 3;
const MEDIA_SIZE = 40;

/** Placeholder di caricamento con la stessa sagoma di NotificationCard. */
export function NotificationCardSkeleton() {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.foreground, borderColor: hexToRgba(colors.border, 0.5) },
      ]}
    >
      <View style={[styles.stripe, { backgroundColor: hexToRgba(colors.border, 0.5) }]} />
      <View style={styles.inner}>
        <SkeletonLine width={MEDIA_SIZE} height={MEDIA_SIZE} radius={12} />
        <View style={styles.content}>
          <SkeletonLine width="55%" height={13} />
          <SkeletonLine width="80%" height={11} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    overflow: 'hidden',
  },
  stripe: {
    width: STRIPE_WIDTH,
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  content: {
    flex: 1,
    gap: 6,
  },
});
