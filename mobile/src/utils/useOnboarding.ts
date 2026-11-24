import { useCallback, useEffect, useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';

const AUTO_ADVANCE_MS = 3200;

type UseOnboardingParams = {
  slideCount: number;
  slideWidth: number;
  /** Finché è false il timer non parte: le slide non sono ancora comparse. */
  enabled: boolean;
};

/**
 * Scorrimento del carosello di onboarding: avanzamento automatico, sincronia con lo swipe manuale
 * e stato "ultima slide raggiunta" (da lì compaiono i bottoni e l'automatismo si ferma).
 */
export function useOnboarding({ slideCount, slideWidth, enabled }: UseOnboardingParams) {
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const isLastSlide = index >= slideCount - 1;

  const goTo = useCallback(
    (next: number) => {
      setIndex(next);
      scrollRef.current?.scrollTo({ x: next * slideWidth, animated: true });
    },
    [slideWidth]
  );

  // L'automatismo si ferma sull'ultima slide: è lo stato finale, non un loop
  useEffect(() => {
    if (!enabled || isLastSlide || slideWidth === 0) return;

    const timer = setTimeout(() => goTo(index + 1), AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [enabled, isLastSlide, slideWidth, index, goTo]);

  // Allinea l'indice quando è l'utente a scorrere, così il timer riparte dalla slide giusta
  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (slideWidth === 0) return;
      setIndex(Math.round(e.nativeEvent.contentOffset.x / slideWidth));
    },
    [slideWidth]
  );

  return { scrollRef, index, isLastSlide, onMomentumScrollEnd };
}
