import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Type } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { darkenColor } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

type LetterResultsProps = {
  values: string[];
};

const DARKEN_AMOUNT = 0.22;

/** Lettere come tessere che si girano (icona a faccia in giù, lettera a faccia in su),
 *  colore a rotazione sui token del tema. */
export function LetterResults({ values }: LetterResultsProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const cycle = [colors.primary, colors.extraColors.three, colors.extraColors.six, colors.extraColors.eight, colors.secondaryGradient, colors.accent];

  return (
    <View style={styles.wrap}>
      {values.map((value, i) => {
        const base = cycle[i % cycle.length];
        const ink = base === colors.accent ? colors.background : colors.textColor;
        return (
          <LetterTile
            key={`${value}-${i}`}
            letter={value}
            delay={150 + i * 110}
            from={base}
            to={darkenColor(base, DARKEN_AMOUNT)}
            ink={ink}
          />
        );
      })}
    </View>
  );
}

function LetterTile({
  letter,
  delay,
  from,
  to,
  ink,
}: {
  letter: string;
  delay: number;
  from: string;
  to: string;
  ink: string;
}) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withDelay(delay, withTiming(180, { duration: 550, easing: Easing.out(Easing.cubic) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sola animazione d'ingresso, nessun valore reattivo da risincronizzare
  }, []);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 600 }, { rotateY: `${rotation.value}deg` }],
  }));
  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 600 }, { rotateY: `${rotation.value + 180}deg` }],
  }));

  return (
    <View style={styles.tile}>
      <Animated.View style={[styles.face, styles.front, { backgroundColor: colors.foreground, borderColor: colors.border }, frontStyle]}>
        <View style={styles.frontIcon}>
          <Type size={21} color={colors.textColor} />
        </View>
      </Animated.View>
      <Animated.View style={[styles.face, backStyle]}>
        <LinearGradient colors={[from, to]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.back}>
          <Text style={[styles.letter, { color: ink }]}>{letter}</Text>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    justifyContent: 'center',
  },
  tile: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 58,
    minWidth: 46,
    maxWidth: 78,
    height: 70,
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 14,
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
  },
  front: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frontIcon: {
    opacity: 0.3,
  },
  back: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontSize: 27,
    fontWeight: '800',
  },
});
