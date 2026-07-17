import { useCallback, useRef, useState } from 'react';
import { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export type AuthCardFace = 'standard' | 'login' | 'register' | 'recover';

const HALF_DURATION = 260;
const PERSPECTIVE = 1000;

const FACE_CONFIG: Record<Exclude<AuthCardFace, 'standard'>, { axis: 'x' | 'y'; sign: 1 | -1 }> = {
  login: { axis: 'y', sign: -1 },
  register: { axis: 'y', sign: 1 },
  recover: { axis: 'x', sign: 1 },
};

/** Anima la AuthCard come un flip 3D: il contenuto viene scambiato esattamente al bordo (90deg), quando è invisibile. */
export function useCardFlip() {
  const [face, setFace] = useState<AuthCardFace>('standard');
  const faceRef = useRef<AuthCardFace>('standard');
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const flipTo = useCallback(
    (next: AuthCardFace) => {
      const current = faceRef.current;
      if (next === current) return;

      const leavingConfig = current !== 'standard' ? FACE_CONFIG[current] : undefined;
      const enteringConfig = next !== 'standard' ? FACE_CONFIG[next] : undefined;
      const config = enteringConfig ?? leavingConfig;
      if (!config) return;

      const sign = enteringConfig ? config.sign : -config.sign;
      const sharedValue = config.axis === 'x' ? rotateX : rotateY;

      faceRef.current = next;
      sharedValue.value = withTiming(sign * 90, { duration: HALF_DURATION }, (finished) => {
        if (!finished) return;
        runOnJS(setFace)(next);
        sharedValue.value = -sign * 90;
        sharedValue.value = withTiming(0, { duration: HALF_DURATION });
      });
    },
    [rotateX, rotateY]
  );

  const flipStyle = useAnimatedStyle(() => {
    if (rotateX.value === 0 && rotateY.value === 0) {
      // Nessun transform 3D a riposo: altrimenti il layer composito sfoca il testo (anti-aliasing sub-pixel).
      return { transform: [] };
    }
    return {
      transform: [
        { perspective: PERSPECTIVE },
        { rotateX: `${rotateX.value}deg` },
        { rotateY: `${rotateY.value}deg` },
      ],
    };
  });

  return { face, flipTo, flipStyle };
}
