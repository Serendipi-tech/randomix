import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import type { CategoryStat } from '@/utils/useProfileStats';
import { CardShell } from '@/components/cards/CardShell';
import { SectionLabel } from '@/components/atoms/SectionLabel';
import { SegmentedControl } from '@/components/atoms/SegmentedControl';
import { HorizontalBarList, type BarDatum } from '@/components/atoms/horizontal-bar-list';

type Metric = 'used' | 'drawn';

const MAX_CATEGORIES = 4;

type ProfileCategoryStatsProps = {
  categoryStats: CategoryStat[];
};

/** Card statistiche categorie: toggle tra "più usate" (conteggio item) e "più sorteggiate"
 *  (somma estrazioni randomizzatore), top 4 + resto accorpato in "Altro". */
export function ProfileCategoryStats({ categoryStats }: ProfileCategoryStatsProps) {
  const { t } = useTranslation('profile');
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const [metric, setMetric] = useState<Metric>('used');

  const bars = useMemo(
    () => buildBars(categoryStats, metric, Object.values(colors.extraColors), colors.disabled, t('charts.categories.other')),
    [categoryStats, metric, colors, t],
  );

  return (
    <CardShell>
      <View style={{ gap: 14 }}>
        <SectionLabel>{t('charts.categories.title')}</SectionLabel>
        <SegmentedControl
          value={metric}
          onChange={setMetric}
          options={[
            { value: 'used', label: t('charts.categories.used') },
            { value: 'drawn', label: t('charts.categories.drawn') },
          ]}
        />
        {bars.length > 0 ? (
          <HorizontalBarList data={bars} />
        ) : (
          <Text style={{ color: colors.disabled, fontSize: 13 }}>{t('charts.categories.empty')}</Text>
        )}
      </View>
    </CardShell>
  );
}

function buildBars(
  categoryStats: CategoryStat[],
  metric: Metric,
  palette: string[],
  otherColor: string,
  otherLabel: string,
): BarDatum[] {
  const key = metric === 'used' ? 'itemsCount' : 'drawCount';
  const sorted = [...categoryStats].filter((c) => c[key] > 0).sort((a, b) => b[key] - a[key]);

  const top = sorted.slice(0, MAX_CATEGORIES).map((c, i) => ({
    key: c.categoryId,
    label: c.name,
    value: c[key],
    color: palette[i % palette.length],
  }));

  const restSum = sorted.slice(MAX_CATEGORIES).reduce((sum, c) => sum + c[key], 0);
  if (restSum > 0) {
    top.push({ key: '__other', label: otherLabel, value: restSum, color: otherColor });
  }

  return top;
}
