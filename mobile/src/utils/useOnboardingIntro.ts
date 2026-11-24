import { useCallback, useEffect, useState } from 'react';
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const FALL_FROM = -420;
const FALL_DURATION = 520;
const SPIN_TURNS = 2;
const ROTATE_DURATION = 1300;
const SCALE_FALL = 1.4;
const SCALE_REST = 1;
const PUFF_SCALE = 1.9;
const PUFF_DURATION = 320;
const SLIDES_FADE_DURATION = 420;

/**
 * Coreografia d'apertura dell'onboarding: il logo cade, rimbalza e ruota; a rotazione finita
 * "fa puff" (si gonfia svanendo) e solo allora compaiono le slide.
 * Separata da `useAuthIntro`, che governa la vecchia apertura del login ed è rimasta intatta.
 */
export function useOnboardingIntro() {
  const fallY = useSharedValue(FALL_FROM);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(SCALE_FALL);
  const logoOpacity = useSharedValue(1);
  const slidesOpacity = useSharedValue(0);

  // Guida il montaggio del carosello: le slide non esistono finché il logo non è svanito
  const [slidesVisible, setSlidesVisible] = useState(false);

  const revealSlides = useCallback(() => {
    setSlidesVisible(true);
    slidesOpacity.value = withTiming(1, {
      duration: SLIDES_FADE_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [slidesOpacity]);

  const puff = useCallback(() => {
    logoOpacity.value = withTiming(0, { duration: PUFF_DURATION, easing: Easing.out(Easing.quad) });
    scale.value = withTiming(
      PUFF_SCALE,
      { duration: PUFF_DURATION, easing: Easing.out(Easing.quad) },
      (finished) => {
        if (finished) runOnJS(revealSlides)();
      }
    );
  }, [logoOpacity, scale, revealSlides]);

  const play = useCallback(() => {
    rotate.value = withTiming(SPIN_TURNS * 360, {
      duration: ROTATE_DURATION,
      easing: Easing.out(Easing.cubic),
    });

    // Il logo entra ingrandito e si assesta mentre cade
    scale.value = withTiming(SCALE_REST, {
      duration: FALL_DURATION,
      easing: Easing.out(Easing.cubic),
    });

    fallY.value = withSequence(
      withTiming(0, { duration: FALL_DURATION, easing: Easing.in(Easing.quad) }),
      withTiming(-32, { duration: 190, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 190, easing: Easing.in(Easing.quad) }),
      withTiming(-12, { duration: 130, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 130, easing: Easing.in(Easing.quad) }),
      // Il logo resta fermo il tempo che la rotazione finisca, poi svanisce
      withTiming(0, { duration: 180 }, (finished) => {
        if (finished) runOnJS(puff)();
      })
    );
  }, [fallY, rotate, scale, puff]);

  useEffect(() => {
    play();
  }, [play]);

  const replay = useCallback(() => {
    setSlidesVisible(false);
    slidesOpacity.value = 0;
    logoOpacity.value = 1;
    fallY.value = FALL_FROM;
    rotate.value = 0;
    scale.value = SCALE_FALL;
    play();
  }, [play, fallY, rotate, scale, logoOpacity, slidesOpacity]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { translateY: fallY.value },
      { rotateZ: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  const slidesStyle = useAnimatedStyle(() => ({ opacity: slidesOpacity.value }));

  return { logoStyle, slidesStyle, slidesVisible, replay };
}
