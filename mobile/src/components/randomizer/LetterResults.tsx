import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { Type } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { darkenColor, isLightColor } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { useRevealCascade } from '@/utils/useRevealCascade';

type LetterResultsProps = {
  values: string[];
};

const DARKEN_AMOUNT = 0.22;
const FLIP_DURATION = 550;
const GAP = 9;
// Tessere per riga: il lato si ricava dalla larghezza disponibile, così restano quadrate
// e tutte uguali anche sugli schermi stretti
const PER_ROW = 5;
const MAX_TILE_SIZE = 70;

/** Lettere come tessere che si girano (icona a faccia in giù, lettera a faccia in su),
 *  colore a rotazione sui token del tema. */
export function LetterResults({ values }: LetterResultsProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  // Rotazione di tinte sature: nessuna e' cosi' chiara da richiedere un trattamento a parte, cosi'
  // tutte le tessere hanno lo stesso gradiente e la lettera resta leggibile su ognuna
  const cycle = [
    colors.primary,
    colors.extraColors.three,
    colors.extraColors.six,
    colors.extraColors.eight,
    colors.secondaryGradient,
  ];

  const [rowWidth, setRowWidth] = useState(0);
  const { delays, skipped, skip } = useRevealCascade(values.length, FLIP_DURATION);
  const onLayout = (e: LayoutChangeEvent) => setRowWidth(e.nativeEvent.layout.width);
  const tileSize = rowWidth
    ? Math.min(MAX_TILE_SIZE, Math.floor((rowWidth - GAP * (PER_ROW - 1)) / PER_ROW))
    : 0;

  return (
    <Pressable style={styles.wrap} onLayout={onLayout} onPress={skip}>
      {tileSize > 0 &&
        values.map((value, i) => {
          const base = cycle[i % cycle.length];
          return (
            <LetterTile
              key={`${value}-${i}`}
              letter={value}
              delay={delays[i]}
              from={base}
              to={darkenColor(base, DARKEN_AMOUNT)}
              // inchiostro scelto sul contrasto, non sul singolo colore: nessuna lettera resta nera
              ink={isLightColor(base) ? colors.background : colors.textColor}
              size={tileSize}
              skip={skipped}
            />
          );
        })}
    </Pressable>
  );
}

function LetterTile({
  letter,
  delay,
  from,
  to,
  ink,
  size,
  skip,
}: {
  letter: string;
  delay: number;
  from: string;
  to: string;
  ink: string;
  size: number;
  skip: boolean;
}) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Salto dell'attesa: la tessera si gira subito
    if (skip) {
      cancelAnimation(rotation);
      rotation.value = 180;
      return;
    }

    rotation.value = withDelay(
      delay,
      withTiming(180, { duration: FLIP_DURATION, easing: Easing.out(Easing.cubic) }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- animazione d'ingresso: riparte solo al salto
  }, [skip]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 600 }, { rotateY: `${rotation.value}deg` }],
  }));
  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 600 }, { rotateY: `${rotation.value + 180}deg` }],
  }));

  return (
    <View style={[styles.tile, { width: size, height: size }]}>
      <Animated.View style={[styles.face, styles.front, { backgroundColor: colors.foreground, borderColor: colors.border }, frontStyle]}>
        <View style={styles.frontIcon}>
          <Type size={Math.round(size * 0.3)} color={colors.textColor} />
        </View>
      </Animated.View>
      <Animated.View style={[styles.face, backStyle]}>
        <LinearGradient colors={[from, to]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.back}>
          <Text style={[styles.letter, { color: ink, fontSize: Math.round(size * 0.42) }]}>{letter}</Text>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  // Quadrata: lato passato dal chiamante, uguale per tutte le tessere
  tile: {},
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
    fontWeight: '800',
    includeFontPadding: false,
  },
});
