import type { ComponentType } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  Check,
  Crown,
  EyeOff,
  ImagePlus,
  LifeBuoy,
  List,
  Megaphone,
  ListChecks,
  Users,
  UserPlus,
  X,
} from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, DisplayFonts, Spacing } from '@/constants/theme';
import { Motion } from '@/constants/motion';
import { hexToRgba } from '@/utils/color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { PageHeader } from '@/components/molecules/PageHeader';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { Button } from '@/components/atoms/Button';
import { Divider } from '@/components/atoms/Divider';
import { CardSkeleton } from '@/components/atoms/CardSkeleton';
import { CardShell } from '@/components/cards/CardShell';
import { PremiumBanner } from '@/components/molecules/premium-banner';
import { DevErrorNotice } from '@/components/atoms/DevErrorNotice';
import { useMyPlan } from '@/utils/useMyPlan';
import { useMyMembership } from '@/utils/useMyMembership';

type RowIcon = ComponentType<{ size?: number; color?: string }>;

/** Icona per chiave di riga: l'elenco delle righe lo decide `formatDetailRows`, qui c'è solo il
 *  loro aspetto. */
const ROW_ICONS: Record<string, RowIcon> = {
  lists: List,
  itemsPerList: ListChecks,
  groupsCreatable: Users,
  groupsJoinable: UserPlus,
  hideItems: EyeOff,
  imageUpload: ImagePlus,
  noAds: Megaphone,
  support: LifeBuoy,
};

const TILE_SIZE = 52;
const TILE_ICON = 26;
const ROW_ICON = 20;
const VALUE_ICON = 18;

/** Piano personale: cosa ha in mano chi guarda, non il catalogo. Il confronto fra i piani sta su
 *  `/plans`, raggiungibile dal banner in fondo. */
export default function MyPlanScreen() {
  const router = useRouter();
  const { t } = useTranslation('profile');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const { hasPaidPlan, planKnown } = useMyPlan();
  const { myPlan, loading, error } = useMyMembership();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader onBack={() => router.back()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
        showsVerticalScrollIndicator={false}
      >
        <DevErrorNotice error={error} source="myMembership" />

        {myPlan ? (
          <Animated.View entering={FadeIn.duration(Motion.contentFade)} style={styles.stack}>
            <CardShell variant="gradient" backgroundColor={colors.foreground} padding={12}>
              <View style={styles.heroRow}>
                <View style={[styles.tile, { backgroundColor: hexToRgba(colors.primary, 0.3) }]}>
                  <Crown size={TILE_ICON} color={colors.textColor} strokeWidth={2} />
                </View>
                <View style={styles.heroTexts}>
                  <Text style={[styles.eyebrow, { color: colors.disabled }]} numberOfLines={1}>
                    {t('settings.payments.plans.myPlan.eyebrowLead')}{' '}
                    <Text style={styles.eyebrowStrong}>
                      {t('settings.payments.plans.myPlan.eyebrowWord')}
                    </Text>
                  </Text>
                  <Text style={[styles.planName, { color: colors.textColor }]} numberOfLines={1}>
                    {myPlan.planLabel}
                  </Text>
                  <Text style={[styles.planCaption, { color: colors.disabled }]} numberOfLines={2}>
                    {myPlan.description ?? myPlan.priceLabel}
                  </Text>
                  {myPlan.endDateLabel && (
                    <Text style={[styles.planCaption, { color: colors.disabled }]} numberOfLines={1}>
                      {myPlan.endDateLabel}
                    </Text>
                  )}
                </View>
              </View>
            </CardShell>

            <SectionHeader title={t('settings.payments.plans.myPlan.detailsTitle')} />

            <CardShell backgroundColor={colors.foreground} borderColor={colors.border} padding={0}>
              {myPlan.detailRows.map((row, index) => {
                const RowIconComponent = ROW_ICONS[row.key] ?? Check;
                return (
                  <View key={row.key}>
                    {index > 0 && <Divider />}
                    <View style={styles.detailRow}>
                      <RowIconComponent size={ROW_ICON} color={colors.disabled} />
                      <Text style={[styles.detailLabel, { color: colors.textColor }]} numberOfLines={1}>
                        {row.label}
                      </Text>
                      {row.value ? (
                        <Text style={[styles.detailValue, { color: colors.disabled }]} numberOfLines={1}>
                          {row.value}
                        </Text>
                      ) : row.available ? (
                        <Check size={VALUE_ICON} color={colors.success} strokeWidth={2.5} />
                      ) : (
                        <X size={VALUE_ICON} color={colors.disabled} strokeWidth={2.5} />
                      )}
                    </View>
                  </View>
                );
              })}
            </CardShell>

            {/* Invito all'upgrade in fondo, dopo il dettaglio: solo a chi non ha già acquistato */}
            {planKnown &&
              (hasPaidPlan ? (
                <Button
                  variant="secondary"
                  label={t('settings.payments.plans.myPlan.comparePlans')}
                  onPress={() => router.push('/plans')}
                />
              ) : (
                <PremiumBanner onPress={() => router.push('/plans')} />
              ))}
          </Animated.View>
        ) : (
          loading && (
            <View style={styles.stack}>
              <CardSkeleton variant="gradient" circleSize={TILE_SIZE} rows={2} />
              <CardSkeleton titled rows={6} />
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  stack: {
    gap: Spacing.three,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTexts: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  eyebrowStrong: {
    fontWeight: '800',
  },
  // Stessa misura e stesso carattere dei titoli di sezione: il nome del piano non è un titolo
  // speciale, deve pesare come gli altri
  planName: {
    fontSize: 18,
    lineHeight: 23,
    fontFamily: DisplayFonts.extraBold,
  },
  planCaption: {
    fontSize: 14,
    lineHeight: 18,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: 44,
    paddingHorizontal: Spacing.three,
  },
  detailLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
