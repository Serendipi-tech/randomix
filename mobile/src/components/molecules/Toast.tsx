import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

export type ToastType = 'success' | 'error' | 'info';

export type ToastProps = {
  message: string;
  type: ToastType;
  duration?: number;
  onDismiss?: () => void;
};

/** Toast component - notification that appears and auto-dismisses.
 *  Single toast with configurable type (success/error/info) and duration. */
export function Toast({ message, type, duration = 3000, onDismiss }: ToastProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const translateY = useSharedValue(-100);

  // Map toast type to color and icon hint
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: colors.success, label: '✓' };
      case 'error':
        return { backgroundColor: colors.error, label: '!' };
      case 'info':
        return { backgroundColor: colors.info, label: 'ℹ' };
    }
  };

  const { backgroundColor, label } = getTypeStyles();

  useEffect(() => {
    // Slide in from top
    translateY.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });

    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      // Slide out to top
      translateY.value = withTiming(-100, {
        duration: 250,
        easing: Easing.in(Easing.cubic),
      });

      // Call dismiss callback after slide-out animation
      setTimeout(() => {
        onDismiss?.();
      }, 250);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        {
          backgroundColor,
          boxShadow: `0px 4px 12px ${hexToRgba(colors.shadow, 0.3)}`,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{label}</Text>
        <Text style={[styles.message, { color: '#fff' }]}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    zIndex: 100,
    elevation: 100,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 48,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});
