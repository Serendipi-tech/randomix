import type { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { CardShell } from '@/components/cards/CardShell';

export type ModeGridItem = {
  key: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  label: string;
  hint: string;
  tint: string;
};

type ModeGridProps = {
  items: ModeGridItem[];
  onSelect: (key: string) => void;
};

/** Griglia 2x2 di card selezionabili, una per modalità del randomizzatore. */
export function ModeGrid({ items, onSelect }: ModeGridProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.grid}>
      {items.map(({ key, icon: Icon, label, hint, tint }) => (
        <View key={key} style={styles.cell}>
          <CardShell onPress={() => onSelect(key)}>
            <View style={[styles.iconBadge, { backgroundColor: hexToRgba(tint, 0.2) }]}>
              <Icon size={20} color={tint} />
            </View>
            <Text style={[styles.label, { color: colors.textColor }]}>{label}</Text>
            <Text style={[styles.hint, { color: colors.textColor }]}>{hint}</Text>
          </CardShell>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  cell: {
    width: '47%',
    flexGrow: 1,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  // sottotitolo attenuato via opacity sul textColor, mai un grigio a parte (vedi PageHeader.subtitle)
  hint: {
    fontSize: 11.5,
    opacity: 0.55,
    lineHeight: 15,
  },
});
