import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type SwitchProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

// Geometria fissa del componente
const TRACK_WIDTH = 50;
const TRACK_HEIGHT = 30;
const THUMB_SIZE = 24;
const THUMB_MARGIN = 2;
// Corsa del thumb: larghezza track meno thumb meno i due margini
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_MARGIN * 2;

/** Switch: track 50×30 con thumb 24×24 animato via reanimated (translateX), cross-platform. */
export function Switch({ value, onChange, disabled = false }: SwitchProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 150 });
  }, [value, progress]);

  // Il thumb scorre da sinistra a destra sull'intera corsa
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * THUMB_TRAVEL }],
  }));

  return (
    <Pressable
      onPress={() => onChange(!value)}
      disabled={disabled}
      hitSlop={7}
      style={[styles.wrapper, disabled && styles.disabled]}
    >
      <View
        style={[
          styles.track,
          {
            backgroundColor: value ? colors.primary : colors.foreground,
            borderColor: value ? colors.primary : colors.border,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            { backgroundColor: value ? colors.foreground : colors.border },
            thumbStyle,
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: TRACK_HEIGHT / 2,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    borderWidth: 1,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    marginLeft: THUMB_MARGIN,
    boxShadow: '0px 1px 3px rgba(0,0,0,0.3)',
  },
});
