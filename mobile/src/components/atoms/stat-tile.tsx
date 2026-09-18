import type { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { CardShell } from '@/components/cards/CardShell';

type StatTileProps = {
  icon: ComponentType<{ size?: number; color?: string }>;
  value: number;
  label: string;
  accentColor: string;
};

/** Tile statistica compatta: icona + numero grande + label, sul guscio `callout` di CardShell.
 *  `flex: 1` sul wrapper esterno: pensata per stare in riga con altre StatTile a larghezza uguale. */
export function StatTile({ icon: Icon, value, label, accentColor }: StatTileProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.wrap}>
      <CardShell variant="callout" borderColor={accentColor}>
        <Icon size={20} color={accentColor} />
        <Text style={[styles.value, { color: colors.textColor }]}>{value}</Text>
        <Text style={[styles.label, { color: colors.disabled }]} numberOfLines={1}>
          {label}
        </Text>
      </CardShell>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
  },
  label: {
    fontSize: 14,
  },
});
