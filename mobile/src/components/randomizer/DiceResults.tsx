import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { useRevealCascade } from '@/utils/useRevealCascade';
import { DiceFace } from '@/components/randomizer/DiceFace';

const TUMBLE_DURATION = 850;

type DiceResultsProps = {
  values: string[];
  faces: number;
  totalLabel: string;
};

/** Facce dei dadi (una forma per fascia di facce), ognuna con un tumble 3D all'ingresso,
 *  più, se sono più di una, la somma. */
export function DiceResults({ values, faces, totalLabel }: DiceResultsProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const total = values.reduce((sum, v) => sum + Number(v), 0);
  const { delays, skipped, skip } = useRevealCascade(values.length, TUMBLE_DURATION);

  return (
    <Pressable style={styles.wrap} onPress={skip}>
      <View style={styles.row}>
        {values.map((value, i) => (
          <TumblingDie
            key={`${value}-${i}`}
            value={Number(value)}
            faces={faces}
            delay={delays[i]}
            skip={skipped}
          />
        ))}
      </View>
      {values.length > 1 && (
        <Text style={[styles.total, { color: colors.textColor, opacity: 0.55 }]}>
          {totalLabel}: {total}
        </Text>
      )}
    </Pressable>
  );
}

function TumblingDie({
  value,
  faces,
  delay,
  skip,
}: {
  value: number;
  faces: number;
  delay: number;
  skip: boolean;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    // Salto dell'attesa: il dado appare subito fermo sul risultato
    if (skip) {
      cancelAnimation(progress);
      progress.value = 1;
      return;
    }

    progress.value = withDelay(
      delay,
      withTiming(1, { duration: TUMBLE_DURATION, easing: Easing.out(Easing.cubic) }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- animazione d'ingresso: riparte solo al salto
  }, [skip]);

  const animatedStyle = useAnimatedStyle(() => {
    const stops = [0, 0.35, 0.7, 1];
    const rotateX = interpolate(progress.value, stops, [0, 280, 560, 720], Extrapolation.CLAMP);
    const rotateY = interpolate(progress.value, stops, [0, 170, 390, 720], Extrapolation.CLAMP);
    const rotateZ = interpolate(progress.value, stops, [0, 50, -15, 0], Extrapolation.CLAMP);
    const scale = interpolate(progress.value, stops, [1, 1.1, 0.94, 1], Extrapolation.CLAMP);
    return {
      // finché non tocca a lui il dado non esiste a schermo: progress resta 0 per tutta l'attesa
      opacity: progress.value > 0 ? 1 : 0,
      transform: [
        { perspective: 800 },
        { rotateX: `${rotateX}deg` },
        { rotateY: `${rotateY}deg` },
        { rotateZ: `${rotateZ}deg` },
        { scale },
      ],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <DiceFace value={value} faces={faces} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  total: {
    fontSize: 15,
    textAlign: 'center',
  },
});
