import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient as SvgLinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { darkenColor } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

export type CoinSide = 'heads' | 'tails';

type CoinResultsProps = {
  side: CoinSide;
  /** Cambia a ogni lancio: fa ripartire l'animazione anche se esce di nuovo la stessa faccia.
   *  A 0 la moneta è ferma, in attesa del primo lancio. */
  flipKey: number;
};

const COIN_SIZE = 150;
const FLIP_DURATION = 1100;
// Mezzi giri completi prima di fermarsi: pari = si torna sulla faccia di partenza
const HALF_TURNS = 8;
const RIM_NOTCHES = 60;
const DOTS = 24;
const EDGE_DARKEN = 0.18;
const FACE_DARKEN = 0.08;
const SYMBOL_DARKEN = 0.45;

/** Moneta che vola, ruota su se stessa e atterra sulla faccia estratta: due facce reali
 *  (corona e croce), non una sola con la scritta sopra. */
export function CoinResults({ side, flipKey }: CoinResultsProps) {
  const progress = useSharedValue(0);
  // mezzo giro in più quando esce croce: la faccia finale è quella giusta
  const halfTurns = HALF_TURNS + (side === 'tails' ? 1 : 0);

  useEffect(() => {
    if (flipKey === 0) return;

    progress.value = 0;
    progress.value = withTiming(1, { duration: FLIP_DURATION, easing: Easing.out(Easing.cubic) });
  }, [flipKey, progress]);

  const tossStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0, 0.45, 1],
          [0, -COIN_SIZE * 0.45, 0],
          Extrapolation.CLAMP,
        ),
      },
      { scale: interpolate(progress.value, [0, 0.45, 1], [0.92, 1.06, 1], Extrapolation.CLAMP) },
    ],
  }));

  const spin = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateX: `${progress.value * halfTurns * 180}deg` }],
  }));

  const backSpin = useAnimatedStyle(() => ({
    transform: [
      { perspective: 900 },
      { rotateX: `${progress.value * halfTurns * 180 + 180}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.wrap, tossStyle]}>
      <Animated.View style={[styles.face, spin]}>
        <CoinFace symbol="heads" />
      </Animated.View>
      <Animated.View style={[styles.face, styles.back, backSpin]}>
        <CoinFace symbol="tails" />
      </Animated.View>
    </Animated.View>
  );
}

/** Una faccia della moneta: bordo zigrinato, bisello, corona di puntini e simbolo inciso. */
function CoinFace({ symbol }: { symbol: CoinSide }) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const edge = darkenColor(colors.secondary, EDGE_DARKEN);
  const faceFill = darkenColor(colors.secondary, FACE_DARKEN);
  const engraving = darkenColor(colors.secondary, SYMBOL_DARKEN);

  return (
    <Svg width={COIN_SIZE} height={COIN_SIZE} viewBox="0 0 100 100">
      <Defs>
        <SvgLinearGradient id="coinRim" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={colors.secondary} />
          <Stop offset="1" stopColor={colors.secondaryGradient} />
        </SvgLinearGradient>
      </Defs>

      {/* bordo esterno a gradiente + zigrinatura */}
      <Circle cx={50} cy={50} r={49} fill="url(#coinRim)" />
      {Array.from({ length: RIM_NOTCHES }, (_, i) => {
        const angle = (i / RIM_NOTCHES) * Math.PI * 2;
        return (
          <Rect
            key={i}
            x={49}
            y={1}
            width={2}
            height={6}
            fill={edge}
            opacity={0.5}
            transform={`rotate(${(angle * 180) / Math.PI} 50 50)`}
          />
        );
      })}

      {/* bisello e campo della faccia */}
      <Circle cx={50} cy={50} r={43} fill={edge} />
      <Circle cx={50} cy={50} r={39} fill={faceFill} />
      <Circle cx={50} cy={50} r={39} fill="none" stroke={engraving} strokeWidth={1} opacity={0.35} />

      {/* corona di puntini incisi */}
      {Array.from({ length: DOTS }, (_, i) => {
        const angle = (i / DOTS) * Math.PI * 2;
        return (
          <Circle
            key={i}
            cx={50 + Math.cos(angle) * 33}
            cy={50 + Math.sin(angle) * 33}
            r={1.4}
            fill={engraving}
            opacity={0.5}
          />
        );
      })}

      <G fill={engraving}>{symbol === 'heads' ? <CrownSymbol /> : <CrossSymbol />}</G>
    </Svg>
  );
}

/** Testa: corona a tre punte con base. */
function CrownSymbol() {
  return (
    <>
      <Path d="M 30 62 L 26 34 L 39 46 L 50 28 L 61 46 L 74 34 L 70 62 Z" />
      <Rect x={30} y={65} width={40} height={7} rx={3} />
    </>
  );
}

/** Croce: una X, due bracci arrotondati uguali incrociati in diagonale. */
function CrossSymbol() {
  return (
    <>
      <Rect x={44} y={24} width={12} height={52} rx={5} transform="rotate(45 50 50)" />
      <Rect x={44} y={24} width={12} height={52} rx={5} transform="rotate(-45 50 50)" />
    </>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: COIN_SIZE,
    height: COIN_SIZE,
    alignSelf: 'center',
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    backfaceVisibility: 'hidden',
  },
  back: {
    // la faccia posteriore parte già girata: durante il volo si alternano davvero
    transform: [{ rotateX: '180deg' }],
  },
});
