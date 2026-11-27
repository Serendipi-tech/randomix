import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import type { CompletionBreakdown } from '@/utils/useProfileStats';
import { CardShell } from '@/components/cards/CardShell';
import { DonutChart } from '@/components/atoms/donut-chart';

type ProfileCompletionDonutProps = {
  breakdown: CompletionBreakdown;
};

/** Card stato di completamento: donut a 3 spicchi (non iniziati/in corso/completati) + legenda,
 *  colori semantici di stato (disabled/warning/success) già usati nel resto dell'app. */
export function ProfileCompletionDonut({ breakdown }: ProfileCompletionDonutProps) {
  const { t } = useTranslation('profile');
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const segments = [
    { key: 'notStarted', value: breakdown.notStarted, color: colors.disabled, label: t('charts.completion.notStarted') },
    { key: 'inProgress', value: breakdown.inProgress, color: colors.warning, label: t('charts.completion.inProgress') },
    { key: 'completed', value: breakdown.completed, color: colors.success, label: t('charts.completion.completed') },
  ];
  const total = breakdown.notStarted + breakdown.inProgress + breakdown.completed;

  return (
    <CardShell title={t('charts.completion.title')}>
      {total > 0 ? (
        <View style={styles.row}>
          <View style={styles.donutSide}>
            <DonutChart segments={segments} trackColor={hexToRgba(colors.border, 0.3)} size={70} strokeWidth={10} />
          </View>
          <View style={[styles.divider, { backgroundColor: hexToRgba(colors.textColor, 0.15) }]} />
          <View style={styles.legend}>
            {segments.map((s) => (
              <View key={s.key} style={styles.legendRow}>
                <View style={[styles.dot, { backgroundColor: s.color }]} />
                <Text style={[styles.legendLabel, { color: colors.textColor }]}>{s.label}</Text>
                <Text style={[styles.legendValue, { color: colors.disabled }]}>{s.value}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <Text style={{ color: colors.disabled, fontSize: 13 }}>{t('charts.completion.empty')}</Text>
      )}
    </CardShell>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  divider: { width: 1, alignSelf: 'stretch' },
  // Due metà uguali: il donut centrato nella sua, la legenda nell'altra
  donutSide: { flex: 1, alignItems: 'center' },
  legend: { flex: 1, gap: 2 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontSize: 14, flex: 1 },
  legendValue: { fontSize: 14, fontWeight: '700' },
});
