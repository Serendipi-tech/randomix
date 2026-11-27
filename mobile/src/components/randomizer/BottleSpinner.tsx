import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors, Spacing } from '@/constants/theme';
import { darkenColor } from '@/utils/color';
import { Badge } from '@/components/atoms/Badge';
import { randomInt } from '@/utils/random';
import { participantInitials, type Participant } from '@/utils/participants';
import { useAppTheme } from '@/utils/useAppTheme';
import { BottleGlyph } from '@/components/randomizer/BottleGlyph';

type BottleSpinnerProps = {
  participants: Participant[];
  /** Indice del vincitore in `participants`; null in modalità "solo spin" (nessun dato, solo visuale). */
  winnerIndex: number | null;
  /** false: la ruota resta ferma, in attesa del primo lancio. */
  spinning: boolean;
  /** Chiamata una volta a giro finito: il chiamante mostra l'estratto. */
  onSettled?: () => void;
};

// Unione dei due schemi: `Colors[colorScheme]` non è restringibile a un solo scheme (literal `as const`)
type ThemeColors = typeof Colors.light | typeof Colors.dark;

export const BOTTLE_SPIN_DURATION = 2200;

const MAX_CIRCLE_SIZE = 300;
// Oltre questo numero di partecipanti i nomi non stanno più sulla circonferenza: ognuno diventa un
// pallino con le iniziali, così la ruota resta leggibile a qualunque numero
const MAX_NAMES_ON_WHEEL = 10;
// Grigio dei nomi non ancora estratti: derivato dal textColor invece di usare il token `disabled`,
// che indica uno stato, non una tinta
const IDLE_NAME_DARKEN = 0.55;
const EXTRA_TURNS = 5;
// Quote proporzionali al diametro: la ruota si adatta alla larghezza disponibile invece di
// avere misure fisse che su schermi stretti escono dal contenitore
const CHIP_WIDTH_RATIO = 0.3;
const CHIP_HEIGHT_RATIO = 0.12;
const DOT_SIZE_RATIO = 0.13;
const BOTTLE_HEIGHT_RATIO = 0.5;
const BOTTLE_WIDTH_RATIO = BOTTLE_HEIGHT_RATIO * 0.46;
// Il Badge non tronca da solo: oltre questa lunghezza il nome viene accorciato con i puntini
const MAX_NAME_CHARS = 10;

/** Bottiglia SVG che gira e si ferma su un angolo target: verso un partecipante (disposto sul
 *  cerchio) se `winnerIndex` è impostato, altrimenti su un angolo casuale puramente visivo.
 *  Il chiamante la rimonta a ogni giro (`key`), così ogni lancio parte da fermo. */
export function BottleSpinner({ participants, winnerIndex, spinning, onSettled }: BottleSpinnerProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const rotation = useSharedValue(0);
  const [settled, setSettled] = useState(false);

  const [availableWidth, setAvailableWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setAvailableWidth(e.nativeEvent.layout.width);
  const size = Math.min(MAX_CIRCLE_SIZE, availableWidth);
  const compact = participants.length > MAX_NAMES_ON_WHEEL;

  useEffect(() => {
    if (!spinning) return;

    const targetAngle =
      winnerIndex != null && participants.length > 0
        ? winnerIndex * (360 / participants.length)
        : randomInt(0, 359);

    rotation.value = withTiming(
      EXTRA_TURNS * 360 + targetAngle,
      { duration: BOTTLE_SPIN_DURATION, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (!finished) return;
        runOnJS(setSettled)(true);
        if (onSettled) runOnJS(onSettled)();
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
          participants.map((participant, i) => (
            <WheelSlot
              key={i}
              participant={participant}
              angleDeg={i * (360 / participants.length)}
              highlighted={settled && winnerIndex === i}
              circleSize={size}
              compact={compact}
              colors={colors}
            />
          ))}

        <Animated.View style={[{ width: bottleWidth, height: bottleHeight }, animatedStyle]}>
          {/* vetro: accent per il corpo, border per il tappo — il viola resta alle CTA */}
          <BottleGlyph
            width={bottleWidth}
            height={bottleHeight}
            glassColor={colors.accent}
            shineColor={colors.textColor}
            capColor={colors.border}
          />
        </Animated.View>
      </View>
    </View>
  );
}

/** Partecipante sulla circonferenza: è il `Badge` pieno dell'app, neutro finché non esce e in
 *  `secondary` quando viene estratto. Con molti partecipanti diventa un pallino con le iniziali. */
function WheelSlot({
  participant,
  angleDeg,
  highlighted,
  circleSize,
  compact,
  colors,
}: {
  participant: Participant;
  angleDeg: number;
  highlighted: boolean;
  circleSize: number;
  compact: boolean;
  colors: ThemeColors;
}) {
  const width = compact ? circleSize * DOT_SIZE_RATIO : circleSize * CHIP_WIDTH_RATIO;
  const height = compact ? circleSize * DOT_SIZE_RATIO : circleSize * CHIP_HEIGHT_RATIO;
  // il raggio tiene conto dell'ingombro della pillola, così nessuna esce dal cerchio
  const radius = circleSize / 2 - height / 2 - Spacing.two;
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const tint = highlighted ? colors.secondary : darkenColor(colors.textColor, IDLE_NAME_DARKEN);

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
      {compact ? (
        <View
          style={[styles.dot, { width, height, borderRadius: width / 2, backgroundColor: tint }]}
        >
          <Text style={[styles.dotLabel, { color: colors.background }]} numberOfLines={1}>
            {participantInitials(participant.name)}
          </Text>
        </View>
      ) : (
        <Badge
          label={
            participant.name.length > MAX_NAME_CHARS
              ? `${participant.name.slice(0, MAX_NAME_CHARS)}…`
              : participant.name
          }
          color={tint}
          solid
        />
      )}
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
  dot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
});
