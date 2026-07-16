import { useCallback, useEffect } from 'react';
import { Dimensions, type LayoutChangeEvent } from 'react-native';
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const FALL_FROM = -420;
const FALL_DURATION = 520;
const SPIN_TURNS = 2;
const ROTATE_DURATION = 1300;
const REST_TILT = -6;
const OFFSCREEN = Dimensions.get('window').height;
const RISE_DURATION = 700;
const GAP = 24;
const MIN_TOP = 24;

/**
 * Coreografia d'apertura del login: il dado cade e rimbalza restando fermo.
 * Il blocco informazioni sale fisicamente da sotto lo schermo (solo posizione, mai opacità).
 * Il dado resta immobile finché il bordo del blocco non lo tocca fisicamente: solo da quel
 * momento i due si muovono insieme, mantenendo il contatto, fino alla posizione finale.
 */
export function useAuthIntro() {
  const fallY = useSharedValue(FALL_FROM);
  const rotate = useSharedValue(0);
  const blockTranslateY = useSharedValue(OFFSCREEN);
  const diceTop = useSharedValue(0);
  const diceBottom = useSharedValue(0);
  const blockNaturalTop = useSharedValue(0);

  const reveal = useCallback(() => {
    blockTranslateY.value = withTiming(0, { duration: RISE_DURATION, easing: Easing.out(Easing.cubic) });
  }, [blockTranslateY]);

  const play = useCallback(() => {
    rotate.value = withTiming(SPIN_TURNS * 360 + REST_TILT, {
      duration: ROTATE_DURATION,
      easing: Easing.out(Easing.cubic),
    });

    fallY.value = withSequence(
      withTiming(0, { duration: FALL_DURATION, easing: Easing.in(Easing.quad) }),
      withTiming(-32, { duration: 190, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 190, easing: Easing.in(Easing.quad) }),
      withTiming(-12, { duration: 130, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 130, easing: Easing.in(Easing.quad) }, (finished) => {
        if (finished) runOnJS(reveal)();
      })
    );
  }, [fallY, rotate, reveal]);

  useEffect(() => {
    play();
  }, [play]);

  const replay = useCallback(() => {
    fallY.value = FALL_FROM;
    rotate.value = 0;
    blockTranslateY.value = OFFSCREEN;
    play();
  }, [play, fallY, rotate, blockTranslateY]);

  const onDiceLayout = useCallback(
    (e: LayoutChangeEvent) => {
      diceTop.value = e.nativeEvent.layout.y;
      diceBottom.value = e.nativeEvent.layout.y + e.nativeEvent.layout.height;
    },
    [diceTop, diceBottom]
  );

  const onBlockLayout = useCallback(
    (e: LayoutChangeEvent) => {
      blockNaturalTop.value = e.nativeEvent.layout.y;
    },
    [blockNaturalTop]
  );

  /**
   * Il dado si muove solo se il blocco lo "tocca": mai prima, mai indipendentemente.
   * Limitato in ogni caso a non far uscire il dado dal bordo superiore visibile.
   */
  const diceShift = useDerivedValue(() => {
    const raw = Math.min(0, blockNaturalTop.value + blockTranslateY.value - GAP - diceBottom.value);
    const floor = MIN_TOP - diceTop.value;
    return Math.max(raw, floor);
  });

  const diceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: fallY.value + diceShift.value }, { rotateZ: `${rotate.value}deg` }],
  }));

  const blockStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: blockTranslateY.value }],
  }));

  return { diceStyle, blockStyle, onDiceLayout, onBlockLayout, replay };
}
