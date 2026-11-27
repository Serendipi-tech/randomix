import type { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckCircle2, List as ListIcon, Users } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { hexToRgba, surfaceFillGradient } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { CardShell } from '@/components/cards/CardShell';
import { EdgeVeil } from '@/components/atoms/EdgeVeil';

type ThemeColors = typeof Colors.light | typeof Colors.dark;

type ProfileStatsPanelProps = {
  listsCount: number;
  totalItemsCount: number;
  completedItemsCount: number;
  friendsCount: number;
};

/** Pannello statistiche profilo: tre colonne separate da divisori verticali, ognuna con icona,
 *  numero in evidenza e label. */
export function ProfileStatsPanel({
  listsCount,
  totalItemsCount,
  completedItemsCount,
  friendsCount,
}: ProfileStatsPanelProps) {
  const { t } = useTranslation('profile');
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const dividerColor = hexToRgba(colors.textColor, 0.15);

  return (
    <CardShell
      variant="gradient"
      gradientBorderWidth={3}
      radius={20}
      padding={12}
      gradientColors={[colors.secondary, colors.extraColors.eight]}
      backgroundGradient={surfaceFillGradient(colors.foreground, colors.primary, colors.extraColors.one)}
    >
      <EdgeVeil color={colors.secondary} />
      <View style={styles.rowContainer}>
        <StatColumn
          icon={ListIcon}
          label={t('stats.lists')}
          value={String(listsCount)}
          colors={colors}
          accentColor={colors.secondaryGradient}
        />
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />
        <StatColumn
          icon={CheckCircle2}
          label={t('stats.completedItems')}
          value={`${completedItemsCount}/${totalItemsCount}`}
          colors={colors}
          accentColor={colors.success}
        />
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />
        <StatColumn
          icon={Users}
          label={t('stats.friends')}
          value={String(friendsCount)}
          colors={colors}
          accentColor={colors.accent}
        />
      </View>
    </CardShell>
  );
}

type StatColumnProps = {
  icon: ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  colors: ThemeColors;
  accentColor: string;
};

function StatColumn({ icon: Icon, label, value, colors, accentColor }: StatColumnProps) {
  return (
    <View style={styles.column}>
      <Icon size={30} color={accentColor} />
      <View style={styles.textBlock}>
        <Text style={[styles.value, { color: colors.textColor }]} numberOfLines={1}>
          {value}
        </Text>
        <Text style={[styles.label, { color: colors.textColor }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // space-between su gruppi a misura di contenuto: i due gruppi esterni toccano i bordi del
  // padding e lo spazio libero si ripartisce in parti uguali attorno ai divisori. Con colonne
  // flex:1 il gruppo corto ("1 Friends") lasciava un vuoto a destra.
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  column: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  textBlock: {
    flexShrink: 1,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
  },
  value: {
    fontSize: 19,
    lineHeight: 22,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    lineHeight: 15,
    opacity: 0.7,
  },
});
