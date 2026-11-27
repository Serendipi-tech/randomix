import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CreditCard } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { PageHeader } from '@/components/molecules/PageHeader';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { FormError } from '@/components/molecules/form-error';
import { CardShell } from '@/components/cards/CardShell';
import { useMembershipPlans } from '@/utils/useMembershipPlans';

/** Pagina dei piani: unico posto dove si confrontano e si cambiano. Vi arrivano il banner del
 *  randomizzatore, la voce in impostazioni e la sheet del limite raggiunto. */
export default function PlansScreen() {
  const router = useRouter();
  const { t } = useTranslation('profile');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];

  const { plans, loading, error } = useMembershipPlans();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading && (
          <Text style={[styles.label, { color: colors.textColor }]}>
            {t('settings.payments.plans.loading')}
          </Text>
        )}
        {error && <FormError message={t('settings.payments.plans.error')} />}

        {plans.map((plan) => (
          <CardShell key={plan.id} backgroundColor={colors.foreground} borderColor={colors.accent}>
            <View style={styles.section}>
              <View style={styles.planHeaderRow}>
                <Text style={[styles.heading, { color: colors.textColor }]}>{plan.planLabel}</Text>
                {plan.isCurrent && (
                  <Badge label={t('settings.payments.plans.yourPlan')} color={colors.accent} />
                )}
              </View>
              <Text style={[styles.value, { color: colors.textColor }]}>{plan.priceLabel}</Text>
              <Text style={[styles.label, { color: colors.textColor }]}>{plan.limitsSummary}</Text>
              {plan.isCurrent && plan.endDateLabel && (
                <Text style={[styles.label, { color: colors.textColor }]}>{plan.endDateLabel}</Text>
              )}
              {!plan.isCurrent && (
                <Button
                  variant="secondary"
                  icon={CreditCard}
                  label={t('settings.payments.plans.changeCta')}
                  onPress={() => {}}
                  disabled
                />
              )}
            </View>
          </CardShell>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.four,
  },
  section: {
    gap: 12,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
