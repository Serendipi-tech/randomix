import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '@/constants/theme';
import { buildFillWavePath } from '@/utils/buildFillWavePath';
import { useAppTheme } from '@/utils/useAppTheme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type ColorResultsProps = {
  values: string[];
};

const FILL_DURATION = 800;
// Stessa onda del pulsante Home della navbar: cresta singola che sale e scorre in x
const WAVE_AMPLITUDE = 5;
const CREST_FROM_RATIO = 0.15;
const CREST_TO_RATIO = 0.55;
const GAP = 10;
// Tre tondi per riga: il diametro si ricava dalla larghezza disponibile
const PER_ROW = 3;
const MAX_SWATCH_SIZE = 96;

/** Tondi colore che si riempiono dal basso con l'onda della navbar, hex sotto in textColor
 *  attenuato (mai il token "disabled" per un testo che non è disabilitato, solo secondario). */
export function ColorResults({ values }: ColorResultsProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const [rowWidth, setRowWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setRowWidth(e.nativeEvent.layout.width);
  const size = rowWidth
    ? Math.min(MAX_SWATCH_SIZE, Math.floor((rowWidth - GAP * (PER_ROW - 1)) / PER_ROW))
    : 0;

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      {size > 0 &&
        values.map((value, i) => (
          <View key={`${value}-${i}`} style={styles.item}>
            <Swatch hex={value} delay={i * FILL_DURATION} size={size} />
            <Text style={[styles.hex, { color: colors.textColor, opacity: 0.55 }]}>{value}</Text>
          </View>
        ))}
    </View>
  );
}

function Swatch({ hex, delay, size }: { hex: string; delay: number; size: number }) {
  const progress = useSharedValue(0);
  const crestX = useSharedValue(size * CREST_FROM_RATIO);

  useEffect(() => {
    const config = { duration: FILL_DURATION, easing: Easing.out(Easing.cubic) };
    progress.value = withDelay(delay, withTiming(1, config));
    // la cresta scorre in x mentre il livello sale: stesso timing, nessuna oscillazione dopo
    crestX.value = withDelay(delay, withTiming(size * CREST_TO_RATIO, config));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sola animazione d'ingresso, nessun valore reattivo da risincronizzare
  }, []);

  const waveProps = useAnimatedProps(() => {
    const waveY = interpolate(
      progress.value,
      [0, 1],
      [size + WAVE_AMPLITUDE, WAVE_AMPLITUDE],
      Extrapolation.CLAMP,
    );
    return { d: buildFillWavePath(size, size, waveY, WAVE_AMPLITUDE, crestX.value) };
  });

  return (
    <View style={[styles.swatch, { width: size, height: size, borderRadius: size / 2 }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <AnimatedPath animatedProps={waveProps} fill={hex} />
      </Svg>
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
  item: {
    alignItems: 'center',
    gap: 5,
  },
  // Tondo: diametro passato dal chiamante, raggio sempre la metà
  swatch: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  hex: {
    fontSize: 14,
    fontWeight: '600',
  },
});
