import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated from 'react-native-reanimated';
import { GradientBackground } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { useAuthIntroReplay } from '@/utils/useAuthIntroReplay';
import { useOnboarding } from '@/utils/useOnboarding';
import { useOnboardingIntro } from '@/utils/useOnboardingIntro';
import { useSlideWobble } from '@/utils/useSlideWobble';
import { useCtaReveal } from '@/utils/useCtaReveal';
import { GradientBackgroundView } from '@/components/molecules/gradient-background';
import { RandoLogo } from '@/components/molecules/rando-logo';
import { OnboardingDots } from '@/components/molecules/onboarding-dots';
import { Button } from '@/components/atoms/Button';
import {
  OnboardingSlides,
  type OnboardingSlide,
} from '@/components/organisms/onboarding/onboarding-slides';

// Pari all'altezza dei bottoni (atoms/Button): la fascia resta occupata anche quando sono nascosti,
// cosi' i pallini non si spostano passando da una slide all'altra.
const BUTTONS_ROW_HEIGHT = 48;

// Altezza dei pallini (molecules/onboarding-dots): lo slot la riserva anche quando sono nascosti
const DOTS_SLOT_HEIGHT = 8;

const SLIDE_IMAGES = [
  require('../../../assets/onboarding/onb-1.webp'),
  require('../../../assets/onboarding/onb-2.webp'),
  require('../../../assets/onboarding/onb-3.webp'),
];

export default function OnboardingScreen() {
  const { t } = useTranslation('auth');
  const { colorScheme } = useAppTheme();
  const { logoStyle, slidesStyle, slidesVisible, replay } = useOnboardingIntro();
  const introReplay = useAuthIntroReplay();
  const router = useRouter();

  const [slideSize, setSlideSize] = useState({ width: 0, height: 0 });
  const { width: slideWidth, height: slideHeight } = slideSize;

  const copy = t('onboarding.slides', { returnObjects: true }) as Omit<OnboardingSlide, 'image'>[];
  const slides: OnboardingSlide[] = copy.map((slide, i) => ({ ...slide, image: SLIDE_IMAGES[i] }));

  const { scrollRef, index, isLastSlide, onMomentumScrollEnd } = useOnboarding({
    slideCount: slides.length,
    slideWidth,
    enabled: slidesVisible,
  });

  const wobbleStyle = useSlideWobble(index);
  const ctaVisible = slidesVisible && isLastSlide;
  const { loginStyle, signupStyle } = useCtaReveal(ctaVisible);

  useEffect(() => {
    // Registra il replay dell'animazione d'ingresso nel bottone globale (root layout).
    introReplay.register(replay);
    return () => introReplay.register(null);
  }, [replay]);

  const onCarouselLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSlideSize({ width, height });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: GradientBackground[colorScheme].stops[0] }]}>
      <GradientBackgroundView colorScheme={colorScheme} />

      <KeyboardAvoidingView style={styles.inner} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.carousel} onLayout={onCarouselLayout}>
          {!slidesVisible && (
            <View style={styles.logoZone}>
              <Animated.View style={logoStyle}>
                <RandoLogo />
              </Animated.View>
            </View>
          )}

          {slidesVisible && slideWidth > 0 && (
            <Animated.View style={[styles.slidesFill, slidesStyle]}>
              <OnboardingSlides
                ref={scrollRef}
                colorScheme={colorScheme}
                slides={slides}
                slideWidth={slideWidth}
                slideHeight={slideHeight}
                activeIndex={index}
                wobbleStyle={wobbleStyle}
                onMomentumScrollEnd={onMomentumScrollEnd}
              />
            </Animated.View>
          )}
        </View>

        <View style={styles.footer}>
          {/* Lo slot resta alto anche a pallini nascosti: durante l'intro della R non deve esserci nulla,
              ma il footer non deve cambiare altezza quando le slide compaiono. */}
          <View style={styles.dotsSlot}>
            {slidesVisible && (
              <OnboardingDots colorScheme={colorScheme} count={slides.length} activeIndex={index} />
            )}
          </View>

          <View style={styles.buttonsRow}>
            {ctaVisible && (
              <>
                <Animated.View style={[styles.buttonCell, loginStyle]}>
                  <Button
                    variant="gradient"
                    label={t('standard.loginCta')}
                    onPress={() => router.push('/(auth)/login')}
                  />
                </Animated.View>
                <Animated.View style={[styles.buttonCell, signupStyle]}>
                  <Button
                    variant="primary"
                    label={t('standard.signupCta')}
                    onPress={() => router.push('/(auth)/signup')}
                  />
                </Animated.View>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1 },
  carousel: { flex: 1 },
  logoZone: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slidesFill: { flex: 1 },
  footer: { paddingHorizontal: 24, paddingBottom: 28, paddingTop: 20, gap: 20 },
  dotsSlot: { height: DOTS_SLOT_HEIGHT, justifyContent: 'center' },
  buttonsRow: { flexDirection: 'row', gap: 12, height: BUTTONS_ROW_HEIGHT },
  buttonCell: { flex: 1 },
});
