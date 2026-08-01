import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { hexToRgba } from '@/utils/color';

type SkeletonLineProps = {
  width?: number | `${number}%`;
};

/** Linea skeleton con pulse (opacità in loop) tinta dal bordo del tema. */
export function SkeletonLine({ width = '100%' }: SkeletonLineProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [pulse]);

  // Opacità 0.55 → 0.95 come nello showcase
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.55 + pulse.value * 0.4,
  }));

  return (
    <Animated.View
      style={[
        styles.line,
        {
          width,
          backgroundColor: hexToRgba(colors.border, 0.5),
          boxShadow: `0px 0px 6px ${hexToRgba(colors.border, 0.3)}`,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  line: {
    height: 12,
    borderRadius: 6,
  },
});
