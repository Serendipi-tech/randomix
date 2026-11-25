import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const RISE = 16;
const FADE_DURATION = 260;
const OVERSHOOT = 1.04;
const STAGGER = 80;

/** Un bottone che sale da sotto comparendo, con un piccolo sforamento in scala prima di assestarsi. */
function usePopIn(visible: boolean, delay: number) {
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!visible) {
      progress.value = 0;
      scale.value = 1;
      return;
    }

    progress.value = withDelay(
      delay,
      withTiming(1, { duration: FADE_DURATION, easing: Easing.out(Easing.cubic) })
    );
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(OVERSHOOT, { duration: 200, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: 140, easing: Easing.out(Easing.quad) })
      )
    );
  }, [visible, delay, progress, scale]);

  return useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * RISE }, { scale: scale.value }],
  }));
}

/** Entrata dei due CTA dell'onboarding: stesso pop-in, il secondo sfasato di `STAGGER` ms. */
export function useCtaReveal(visible: boolean) {
  const loginStyle = usePopIn(visible, 0);
  const signupStyle = usePopIn(visible, STAGGER);

  return { loginStyle, signupStyle };
}
