import { useCallback, useEffect, useState } from 'react';
import { Easing, runOnJS, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

const FALL_FROM = -420;
const FALL_DURATION = 520;
const SPIN_TURNS = 3;
const REST_TILT = -6;

/**
 * Coreografia d'apertura del login: il dado cade e rimbalza restando centrato (flexbox).
 * Quando la card appare, il ricentraggio del contenuto sposta il dado verso l'alto in modo
 * proporzionale a quanto spazio occupa davvero la card — non un valore fisso indovinato.
 */
export function useAuthIntro() {
  const fallY = useSharedValue(FALL_FROM);
  const rotate = useSharedValue(0);
  const [cardVisible, setCardVisible] = useState(false);

  const play = useCallback(() => {
    rotate.value = withTiming(SPIN_TURNS * 360 + REST_TILT, {
      duration: FALL_DURATION + 480,
      easing: Easing.out(Easing.cubic),
    });

    fallY.value = withSequence(
      withTiming(0, { duration: FALL_DURATION, easing: Easing.in(Easing.quad) }),
      withTiming(-32, { duration: 190, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 190, easing: Easing.in(Easing.quad) }),
      withTiming(-12, { duration: 130, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 130, easing: Easing.in(Easing.quad) }, (finished) => {
        if (finished) runOnJS(setCardVisible)(true);
      })
    );
  }, [fallY, rotate]);

  useEffect(() => {
    play();
  }, [play]);

  const replay = useCallback(() => {
    setCardVisible(false);
    fallY.value = FALL_FROM;
    rotate.value = 0;
    play();
  }, [play, fallY, rotate]);

  const diceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: fallY.value }, { rotateZ: `${rotate.value}deg` }],
  }));

  return { diceStyle, cardVisible, replay };
}
