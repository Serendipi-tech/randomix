import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors, Spacing } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

type BottleSpinnerProps = {
  names: string[];
  /** Indice del vincitore in `names`; null in modalità "solo spin" (nessun dato, solo visuale). */
  winnerIndex: number | null;
  /** Cambia a ogni nuovo giro per far ripartire l'animazione (0 = nessun giro ancora fatto). */
  spinKey: number;
  winnerLabel: string;
};

// Unione dei due schemi: `Colors[colorScheme]` non è restringibile a un solo scheme (literal `as const`)
type ThemeColors = typeof Colors.light | typeof Colors.dark;

const CIRCLE_SIZE = 260;
const RADIUS = CIRCLE_SIZE / 2 - 30;
export const BOTTLE_SPIN_DURATION = 2200;
const EXTRA_TURNS = 5;

/** Bottiglia SVG che gira e si ferma su un angolo target: verso un nome (disposto sul cerchio) se
 *  `winnerIndex` è impostato, altrimenti su un angolo casuale puramente visivo. */
export function BottleSpinner({ names, winnerIndex, spinKey, winnerLabel }: BottleSpinnerProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const rotation = useSharedValue(0);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (spinKey === 0) return;
    setSettled(false);
    const targetAngle =
      winnerIndex != null && names.length > 0 ? winnerIndex * (360 / names.length) : Math.random() * 360;
    rotation.value = withTiming(
      rotation.value + EXTRA_TURNS * 360 + targetAngle - (rotation.value % 360),
      { duration: BOTTLE_SPIN_DURATION, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(setSettled)(true);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinKey]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ rotateZ: `${rotation.value}deg` }] }));

  return (
    <View style={styles.circle}>
      {names.map((name, i) => (
        <NameChip
          key={i}
          name={name}
          angleDeg={i * (360 / names.length)}
          highlighted={settled && winnerIndex === i}
          colors={colors}
        />
      ))}
      <Animated.View style={[styles.bottleWrap, animatedStyle]}>
        <Svg width={60} height={130} viewBox="0 0 60 130">
          <Rect x={20} y={4} width={20} height={14} rx={4} fill={colors.disabled} />
          <Rect x={22} y={14} width={16} height={50} rx={6} fill={colors.primary} />
          <Rect x={10} y={58} width={40} height={68} rx={16} fill={colors.primary} />
        </Svg>
      </Animated.View>
      {settled && winnerIndex != null && names[winnerIndex] && (
        <Text style={[styles.winnerText, { color: colors.textColor }]}>
          {winnerLabel}: {names[winnerIndex]}
        </Text>
      )}
    </View>
  );
}

function NameChip({
  name,
  angleDeg,
  highlighted,
  colors,
}: {
  name: string;
  angleDeg: number;
  highlighted: boolean;
  colors: ThemeColors;
}) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const x = RADIUS * Math.cos(rad);
  const y = RADIUS * Math.sin(rad);

  return (
    <View
      style={[
        styles.chip,
        {
          left: CIRCLE_SIZE / 2 + x - 36,
          top: CIRCLE_SIZE / 2 + y - 14,
          backgroundColor: highlighted ? colors.primary : hexToRgba(colors.border, 0.25),
        },
      ]}
    >
      <Text numberOfLines={1} style={[styles.chipText, { color: highlighted ? '#fff' : colors.textColor }]}>
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottleWrap: {
    width: 60,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    position: 'absolute',
    width: 72,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  winnerText: {
    position: 'absolute',
    bottom: -Spacing.five,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
