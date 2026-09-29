import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import type { DrawAcceptance } from '@/utils/useProfileStats';
import { CardShell } from '@/components/cards/CardShell';
import { SectionLabel } from '@/components/atoms/SectionLabel';
import { SplitBar } from '@/components/atoms/split-bar';

type ProfileDrawAcceptanceProps = {
  acceptance: DrawAcceptance;
};

/** Card tasto di accettazione del randomizzatore: quante volte l'utente accetta il primo
 *  risultato (acceptedCount) contro quante volte rigenera (skippedCount), su tutte le liste. */
export function ProfileDrawAcceptance({ acceptance }: ProfileDrawAcceptanceProps) {
  const { t } = useTranslation('profile');
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const total = acceptance.accepted + acceptance.skipped;
  const acceptedPct = total > 0 ? Math.round((acceptance.accepted / total) * 100) : 0;

  return (
    <CardShell>
      <View style={{ gap: 12 }}>
        <SectionLabel>{t('charts.drawAcceptance.title')}</SectionLabel>
        {total > 0 ? (
          <>
            <SplitBar
              segments={[
                { value: acceptance.accepted, color: colors.success },
                { value: acceptance.skipped, color: colors.disabled },
              ]}
              trackColor={hexToRgba(colors.border, 0.3)}
            />
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: colors.success }]} />
                <Text style={[styles.legendLabel, { color: colors.textColor }]}>
                  {t('charts.drawAcceptance.accepted')} · {acceptedPct}%
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: colors.disabled }]} />
                <Text style={[styles.legendLabel, { color: colors.textColor }]}>
                  {t('charts.drawAcceptance.skipped')} · {100 - acceptedPct}%
                </Text>
              </View>
            </View>
          </>
        ) : (
          <Text style={{ color: colors.disabled, fontSize: 13 }}>{t('charts.drawAcceptance.empty')}</Text>
        )}
      </View>
    </CardShell>
  );
}

const styles = StyleSheet.create({
  legendRow: { flexDirection: 'row', justifyContent: 'space-between' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontSize: 12.5, fontWeight: '600' },
});
