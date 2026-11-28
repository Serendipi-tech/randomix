import type { ComponentType } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Crown, EyeOff, Headphones, ImagePlus, Infinity as InfinityIcon, LayoutGrid, ListChecks, Megaphone } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, DisplayFonts, Spacing } from '@/constants/theme';
import { Motion } from '@/constants/motion';
import { hexToRgba } from '@/utils/color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { PageHeader } from '@/components/molecules/PageHeader';
import { Button } from '@/components/atoms/Button';
import { Divider } from '@/components/atoms/Divider';
import { CardSkeleton } from '@/components/atoms/CardSkeleton';
import { CardShell } from '@/components/cards/CardShell';
import { PremiumCrown } from '@/components/atoms/premium-crown';
import { DevErrorNotice } from '@/components/atoms/DevErrorNotice';
import { useToast } from '@/utils/useToast';
import { usePremiumPlan } from '@/utils/usePremiumPlan';

type HighlightIcon = ComponentType<{ size?: number; color?: string }>;

/** Icona per chiave di punto di forza: l'elenco lo decide `formatHighlights`, qui c'è solo il
 *  suo aspetto. */
const HIGHLIGHT_ICONS: Record<string, HighlightIcon> = {
  lists: InfinityIcon,
  itemsPerList: ListChecks,
  groups: LayoutGrid,
  imageUpload: ImagePlus,
  hideItems: EyeOff,
  noAds: Megaphone,
  support: Headphones,
};

const CROWN_HEIGHT = 34;
const TILE_SIZE = 34;
const TILE_ICON = 18;

/** Proposta di passaggio al piano a pagamento: un solo taglio, nessun confronto fra piani (quello
 *  che si ha in mano sta su `/my-plan`). Vi arrivano il banner premium e la pagina del piano. */
export default function PlansScreen() {
  const router = useRouter();
  const { t } = useTranslation('profile');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const toast = useToast();

  const { premiumPlan, loading, error } = usePremiumPlan();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader onBack={() => router.back()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
        showsVerticalScrollIndicator={false}
      >
        <DevErrorNotice error={error} source="membershipPlans" />

        {premiumPlan ? (
          <Animated.View entering={FadeIn.duration(Motion.contentFade)} style={styles.stack}>
            <CardShell variant="gradient" backgroundColor={colors.foreground} padding={14}>
              <View style={styles.hero}>
                <PremiumCrown height={CROWN_HEIGHT} />
                <Text style={[styles.heroTitle, { color: colors.textColor }]} numberOfLines={1}>
                  {t('settings.payments.plans.upgrade.title', { plan: premiumPlan.planLabel })}
                </Text>
              </View>

              <Divider />

              <View style={styles.highlights}>
                {premiumPlan.highlights.map((highlight) => {
                  const HighlightIconComponent = HIGHLIGHT_ICONS[highlight.key] ?? Crown;
                  return (
                    <View key={highlight.key} style={styles.highlightRow}>
                      <View style={[styles.tile, { backgroundColor: hexToRgba(colors.primary, 0.3) }]}>
                        <HighlightIconComponent size={TILE_ICON} color={colors.textColor} />
                      </View>
                      <View style={styles.highlightTexts}>
                        <Text style={[styles.highlightTitle, { color: colors.textColor }]}>
                          {highlight.title}
                        </Text>
                        <Text style={[styles.highlightCaption, { color: colors.disabled }]}>
                          {highlight.caption}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </CardShell>

            {/* Un solo taglio di prezzo: niente scelta fra mensile e annuale, quindi un riquadro
                informativo e non un selettore */}
            <CardShell backgroundColor={colors.foreground} borderColor={colors.accent} padding={12}>
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: colors.textColor }]}>
                  {t('settings.payments.plans.upgrade.priceLabel')}
                </Text>
                <View style={styles.priceAmountRow}>
                  <Text style={[styles.priceAmount, { color: colors.textColor }]}>
                    {premiumPlan.priceAmount}
                  </Text>
                  <Text style={[styles.priceSuffix, { color: colors.disabled }]}>
                    {premiumPlan.billingSuffix}
                  </Text>
                </View>
              </View>
            </CardShell>

            <Button
              variant="gradient"
              icon={Crown}
              label={t('settings.payments.plans.upgrade.cta')}
              onPress={() => toast.info(t('settings.payments.comingSoon.subtitle'))}
            />
          </Animated.View>
        ) : (
          loading && (
            <View style={styles.stack}>
              <CardSkeleton titled rows={2} />
              <CardSkeleton rows={7} />
              <CardSkeleton rows={1} />
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
    gap: Spacing.two + Spacing.one,
  },
  // Testata dentro la card: corona, nome del piano e riga di presentazione, poi il filetto che
  // la separa dall'elenco. Un blocco solo, niente testo libero sopra la card
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.half,
    marginBottom: Spacing.two + Spacing.half,
  },
  heroTitle: {
    flexShrink: 1,
    fontSize: 20,
    lineHeight: 25,
    fontFamily: DisplayFonts.extraBold,
  },
  highlights: {
    gap: Spacing.two + Spacing.half,
    marginTop: Spacing.two + Spacing.half,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.half,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightTexts: {
    flex: 1,
    gap: 1,
  },
  highlightTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
  },
  highlightCaption: {
    fontSize: 12,
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  priceAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.one,
  },
  priceAmount: {
    fontSize: 20,
    fontFamily: DisplayFonts.extraBold,
  },
  priceSuffix: {
    fontSize: 13,
  },
});
