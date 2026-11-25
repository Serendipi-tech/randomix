import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const SWINGS = [-3.2, 2.2, -1.1, 0] as const;
const DURATIONS = [170, 190, 160, 140] as const;

/** Oscillazione d'apertura dell'illustrazione: a ogni cambio slide l'immagine ruota avanti e indietro
 *  smorzandosi fino a zero. Si riavvia solo al cambio di `index`, non resta in loop. */
export function useSlideWobble(index: number) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withSequence(
      ...SWINGS.map((deg, i) =>
        withTiming(deg, { duration: DURATIONS[i], easing: Easing.inOut(Easing.quad) })
      )
    );
  }, [index, rotation]);

  return useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));
}
