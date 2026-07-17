import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/theme';

interface ListCardSkeletonProps {
  colorScheme: 'light' | 'dark';
}

/** Placeholder di caricamento con la stessa sagoma di ListCard. */
export function ListCardSkeleton({ colorScheme }: ListCardSkeletonProps) {
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.card, { backgroundColor: colors.backgroundElement }]}>
      <View style={[styles.iconChip, { backgroundColor: colors.backgroundSelected }]} />
      <View style={styles.textZone}>
        <View style={[styles.lineTitle, { backgroundColor: colors.backgroundSelected }]} />
        <View style={[styles.lineSubtitle, { backgroundColor: colors.backgroundSelected }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 20,
    padding: 16,
  },
  iconChip: {
    width: 48,
    height: 48,
    borderRadius: 16,
  },
  textZone: {
    flex: 1,
    gap: 8,
  },
  lineTitle: {
    height: 16,
    width: '55%',
    borderRadius: 8,
  },
  lineSubtitle: {
    height: 12,
    width: '80%',
    borderRadius: 6,
  },
});
