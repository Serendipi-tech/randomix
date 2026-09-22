import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

type SwitchProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

// Geometria del componente
const TRACK_WIDTH = 46;
const TRACK_HEIGHT = 28;
const THUMB_SIZE = 22;
const THUMB_MARGIN = 3;
// Corsa del thumb: larghezza track meno thumb meno i due margini
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_MARGIN * 2;
const DURATION = 180;

/** Toggle: track che vira colore (border → primary) e thumb bianco con ombra morbida che scorre.
 *  Animazione fluida senza rimbalzi, cross-platform. */
export function Switch({ value, onChange, disabled = false }: SwitchProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: DURATION });
  }, [value, progress]);

  // Vira il colore del track in modo continuo tra spento e acceso
  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.border, colors.primary]),
  }));
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * THUMB_TRAVEL }],
  }));

  return (
    <Pressable onPress={() => onChange(!value)} disabled={disabled} hitSlop={8} style={disabled ? styles.disabled : undefined}>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, { boxShadow: `0px 1px 3px ${hexToRgba(colors.shadow, 0.25)}` }, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: 'center',
    paddingHorizontal: THUMB_MARGIN,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    // Thumb chiaro fisso (leggibile su entrambe le tinte del track), come i toggle standard
    backgroundColor: '#FFFFFF',
  },
});
