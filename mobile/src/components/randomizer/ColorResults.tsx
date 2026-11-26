import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  cancelAnimation,
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
import { useCopyToClipboard } from '@/utils/useCopyToClipboard';
import { useRevealCascade } from '@/utils/useRevealCascade';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type ColorResultsProps = {
  values: string[];
  /** Messaggio di conferma mostrato dopo aver copiato un hex. */
  copiedLabel: string;
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
export function ColorResults({ values, copiedLabel }: ColorResultsProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const { copy } = useCopyToClipboard();

  const [rowWidth, setRowWidth] = useState(0);
  const { delays, skipped, skip } = useRevealCascade(values.length, FILL_DURATION);
  const onLayout = (e: LayoutChangeEvent) => setRowWidth(e.nativeEvent.layout.width);
  const size = rowWidth
    ? Math.min(MAX_SWATCH_SIZE, Math.floor((rowWidth - GAP * (PER_ROW - 1)) / PER_ROW))
    : 0;

  return (
    // il tocco sullo sfondo salta l'attesa, quello su un colore ne copia l'hex
    <Pressable style={styles.wrap} onLayout={onLayout} onPress={skip}>
      {size > 0 &&
        values.map((value, i) => (
          <Pressable
            key={`${value}-${i}`}
            style={styles.item}
            onPress={() => copy(value, copiedLabel)}
          >
            <Swatch hex={value} delay={delays[i]} size={size} skip={skipped} />
            <Text style={[styles.hex, { color: colors.textColor, opacity: 0.55 }]}>{value}</Text>
          </Pressable>
        ))}
    </Pressable>
  );
}

function Swatch({
  hex,
  delay,
  size,
  skip,
}: {
  hex: string;
  delay: number;
  size: number;
  skip: boolean;
}) {
  const progress = useSharedValue(0);
  const crestX = useSharedValue(size * CREST_FROM_RATIO);

  useEffect(() => {
    // Salto dell'attesa: il tondo risulta pieno subito
    if (skip) {
      cancelAnimation(progress);
      cancelAnimation(crestX);
      progress.value = 1;
      crestX.value = size * CREST_TO_RATIO;
      return;
    }

    const config = { duration: FILL_DURATION, easing: Easing.out(Easing.cubic) };
    progress.value = withDelay(delay, withTiming(1, config));
    // la cresta scorre in x mentre il livello sale: stesso timing, nessuna oscillazione dopo
    crestX.value = withDelay(delay, withTiming(size * CREST_TO_RATIO, config));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- animazione d'ingresso: riparte solo al salto
  }, [skip]);

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
