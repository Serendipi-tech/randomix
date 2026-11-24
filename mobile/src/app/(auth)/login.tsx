import { useEffect, useState } from 'react';
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
import { useAuthForms } from '@/utils/useAuthForms';
import { useOnboarding } from '@/utils/useOnboarding';
import { useOnboardingIntro } from '@/utils/useOnboardingIntro';
import { GradientBackgroundView } from '@/components/molecules/gradient-background';
import { RandoLogo } from '@/components/molecules/rando-logo';
import { OnboardingDots } from '@/components/molecules/onboarding-dots';
import { Button } from '@/components/atoms/Button';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import {
  OnboardingSlides,
  type OnboardingSlide,
} from '@/components/organisms/onboarding/onboarding-slides';
import { LoginForm } from '@/components/organisms/login-form';
import { SignupForm } from '@/components/organisms/signup-form';

type ActiveSheet = 'login' | 'signup' | null;

const SLIDE_IMAGES = [
  require('../../../assets/onboarding/onb-1.webp'),
  require('../../../assets/onboarding/onb-2.webp'),
  require('../../../assets/onboarding/onb-3.webp'),
];

export default function AuthScreen() {
  const { t } = useTranslation('auth');
  const { colorScheme } = useAppTheme();
  const { logoStyle, slidesStyle, slidesVisible, replay } = useOnboardingIntro();
  const introReplay = useAuthIntroReplay();
  const forms = useAuthForms();

  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [slideSize, setSlideSize] = useState({ width: 0, height: 0 });
  const { width: slideWidth, height: slideHeight } = slideSize;

  const copy = t('onboarding.slides', { returnObjects: true }) as Omit<OnboardingSlide, 'image'>[];
  const slides: OnboardingSlide[] = copy.map((slide, i) => ({ ...slide, image: SLIDE_IMAGES[i] }));

  const { scrollRef, index, isLastSlide, onMomentumScrollEnd } = useOnboarding({
    slideCount: slides.length,
    slideWidth,
    enabled: slidesVisible,
  });

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
                onMomentumScrollEnd={onMomentumScrollEnd}
              />
            </Animated.View>
          )}
        </View>

        <View style={styles.footer}>
          <OnboardingDots colorScheme={colorScheme} count={slides.length} activeIndex={index} />

          {slidesVisible && isLastSlide && (
            <View style={styles.buttonsRow}>
              <View style={styles.buttonCell}>
                <Button label={t('standard.loginCta')} onPress={() => setActiveSheet('login')} />
              </View>
              <View style={styles.buttonCell}>
                <Button
                  variant="ghost"
                  label={t('standard.signupCta')}
                  onPress={() => setActiveSheet('signup')}
                />
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>

      <BottomSheet visible={activeSheet === 'login'} onClose={() => setActiveSheet(null)}>
        <LoginForm
          colorScheme={colorScheme}
          identifier={forms.loginIdentifier}
          onIdentifierChange={forms.setLoginIdentifier}
          password={forms.loginPassword}
          onPasswordChange={forms.setLoginPassword}
          error={forms.loginError}
          loading={forms.loading}
          onSubmit={forms.submitLogin}
        />
      </BottomSheet>

      <BottomSheet visible={activeSheet === 'signup'} onClose={() => setActiveSheet(null)}>
        <SignupForm
          colorScheme={colorScheme}
          email={forms.registerEmail}
          onEmailChange={forms.setRegisterEmail}
          username={forms.registerUsername}
          onUsernameChange={forms.setRegisterUsername}
          password={forms.registerPassword}
          onPasswordChange={forms.setRegisterPassword}
          confirmPassword={forms.registerConfirmPassword}
          onConfirmPasswordChange={forms.setRegisterConfirmPassword}
          error={forms.registerError}
          loading={forms.loading}
          onSubmit={forms.submitRegister}
        />
      </BottomSheet>
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
  buttonsRow: { flexDirection: 'row', gap: 12 },
  buttonCell: { flex: 1 },
});
