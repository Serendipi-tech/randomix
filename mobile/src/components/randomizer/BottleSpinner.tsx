import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors, Spacing } from '@/constants/theme';
import { darkenColor } from '@/utils/color';
import { Badge } from '@/components/atoms/Badge';
import { randomInt } from '@/utils/random';
import { useAppTheme } from '@/utils/useAppTheme';

type BottleSpinnerProps = {
  names: string[];
  /** Indice del vincitore in `names`; null in modalità "solo spin" (nessun dato, solo visuale). */
  winnerIndex: number | null;
  /** false: la ruota resta ferma, in attesa del primo lancio. */
  spinning: boolean;
};

// Unione dei due schemi: `Colors[colorScheme]` non è restringibile a un solo scheme (literal `as const`)
type ThemeColors = typeof Colors.light | typeof Colors.dark;

export const BOTTLE_SPIN_DURATION = 2200;

const MAX_CIRCLE_SIZE = 300;
// Sagoma della bottiglia dentro il viewBox 60x130: collo, spalle curve, corpo e fondo arrotondato
const BOTTLE_BODY_PATH =
  'M 24 12 L 24 42 C 24 54 12 58 12 74 L 12 114 Q 12 126 24 126 L 36 126 Q 48 126 48 114 L 48 74 C 48 58 36 54 36 42 L 36 12 Z';
// Riflesso del vetro: una sottile striscia chiara lungo il fianco sinistro
const BOTTLE_SHINE_PATH = 'M 28 18 L 28 44 C 28 56 17 60 17 74 L 17 110 L 22 110 L 22 74 C 22 60 33 56 33 44 L 33 18 Z';
const BOTTLE_DARKEN = 0.3;
// Il Badge non tronca da solo: oltre questa lunghezza il nome viene accorciato con i puntini
const MAX_NAME_CHARS = 10;
// Grigio dei nomi non ancora estratti: derivato dal textColor invece di usare il token `disabled`,
// che indica uno stato, non una tinta
const IDLE_NAME_DARKEN = 0.55;
const EXTRA_TURNS = 5;
// Quote proporzionali al diametro: la ruota si adatta alla larghezza disponibile invece di
// avere misure fisse che su schermi stretti escono dal contenitore
const CHIP_WIDTH_RATIO = 0.3;
const CHIP_HEIGHT_RATIO = 0.12;
const BOTTLE_HEIGHT_RATIO = 0.5;
const BOTTLE_WIDTH_RATIO = BOTTLE_HEIGHT_RATIO * 0.46;

/** Bottiglia SVG che gira e si ferma su un angolo target: verso un nome (disposto sul cerchio) se
 *  `winnerIndex` è impostato, altrimenti su un angolo casuale puramente visivo.
 *  Il chiamante la rimonta a ogni giro (`key`), così ogni lancio parte da fermo. */
export function BottleSpinner({ names, winnerIndex, spinning }: BottleSpinnerProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const rotation = useSharedValue(0);
  const [settled, setSettled] = useState(false);

  const [availableWidth, setAvailableWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setAvailableWidth(e.nativeEvent.layout.width);
  const size = Math.min(MAX_CIRCLE_SIZE, availableWidth);

  useEffect(() => {
    if (!spinning) return;

    const targetAngle =
      winnerIndex != null && names.length > 0 ? winnerIndex * (360 / names.length) : randomInt(0, 359);

    rotation.value = withTiming(
      EXTRA_TURNS * 360 + targetAngle,
      { duration: BOTTLE_SPIN_DURATION, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(setSettled)(true);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- un solo giro per montaggio: il chiamante rimonta con una key nuova a ogni lancio
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ rotateZ: `${rotation.value}deg` }] }));

  const bottleHeight = size * BOTTLE_HEIGHT_RATIO;
  const bottleWidth = size * BOTTLE_WIDTH_RATIO;

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      <View style={[styles.circle, { width: size, height: size }]}>
        {size > 0 &&
          names.map((name, i) => (
            <WheelName
              key={i}
              name={name}
              angleDeg={i * (360 / names.length)}
              highlighted={settled && winnerIndex === i}
              circleSize={size}
              colors={colors}
            />
          ))}

        <Animated.View style={[{ width: bottleWidth, height: bottleHeight }, animatedStyle]}>
          <Svg width={bottleWidth} height={bottleHeight} viewBox="0 0 60 130">
            {/* vetro: accent per il corpo, border per il tappo — il viola resta alle CTA */}
            <Path d={BOTTLE_BODY_PATH} fill={colors.accent} />
            {/* etichetta: fascia più scura sul corpo, come su una bottiglia vera */}
            <Rect
              x={12}
              y={84}
              width={36}
              height={26}
              fill={darkenColor(colors.accent, BOTTLE_DARKEN)}
            />
            <Path d={BOTTLE_SHINE_PATH} fill={colors.textColor} opacity={0.25} />
            {/* tappo: due pezzi, capsula e anello del collo */}
            <Rect x={21} y={2} width={18} height={11} rx={3} fill={colors.border} />
            <Rect x={22} y={15} width={16} height={4} rx={2} fill={colors.border} />
          </Svg>
        </Animated.View>
      </View>

    </View>
  );
}

/** Nome di un partecipante sulla circonferenza: è il `Badge` dell'app, neutro finché non esce;
 *  il vincitore passa a `secondary`. */
function WheelName({
  name,
  angleDeg,
  highlighted,
  circleSize,
  colors,
}: {
  name: string;
  angleDeg: number;
  highlighted: boolean;
  circleSize: number;
  colors: ThemeColors;
}) {
  const width = circleSize * CHIP_WIDTH_RATIO;
  const height = circleSize * CHIP_HEIGHT_RATIO;
  // il raggio tiene conto dell'ingombro della pillola, così nessuna esce dal cerchio
  const radius = circleSize / 2 - height / 2 - Spacing.two;
  const rad = ((angleDeg - 90) * Math.PI) / 180;

  return (
    <View
      style={[
        styles.chip,
        {
          width,
          height,
          left: circleSize / 2 + radius * Math.cos(rad) - width / 2,
          top: circleSize / 2 + radius * Math.sin(rad) - height / 2,
        },
      ]}
    >
      <Badge
        label={name.length > MAX_NAME_CHARS ? `${name.slice(0, MAX_NAME_CHARS)}…` : name}
        color={highlighted ? colors.secondary : darkenColor(colors.textColor, IDLE_NAME_DARKEN)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
