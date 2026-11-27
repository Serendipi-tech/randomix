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

  // Colore d'accento per tipo, stesso ruolo di Button variant="confirm"/"destructive": bordo
  // pieno + sfondo sfumato nello stesso colore, non un riempimento pieno (poco leggibile col
  // verde/rosso del tema, molto saturi)
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return { accentColor: colors.success, label: '✓' };
      case 'error':
        return { accentColor: colors.error, label: '!' };
      case 'info':
        return { accentColor: colors.info, label: 'ℹ' };
    }
  };

  const { accentColor, label } = getTypeStyles();

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
          // Base piena (card del tema): resta leggibile a prescindere da cosa c'e' sotto il
          // toast (sfondi radiali diversi per schermata). La tinta di stato va sopra questa base,
          // non sopra la pagina reale, cosi' non si "perde" come con un overlay trasparente puro.
          backgroundColor: colors.foreground,
          borderWidth: 1.5,
          borderColor: accentColor,
          boxShadow: `0px 4px 12px ${hexToRgba(colors.shadow, 0.3)}`,
        },
      ]}
    >
      {/* Tinta di stato, stessa proporzione dell'Alert di colors-showcase (hexToRgba 0.1) */}
      <View style={[StyleSheet.absoluteFill, styles.tint, { backgroundColor: hexToRgba(accentColor, 0.1) }]} />
      <View style={styles.content}>
        <Text style={[styles.icon, { color: accentColor }]}>{label}</Text>
        <Text style={[styles.message, { color: colors.textColor }]}>{message}</Text>
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
    overflow: 'hidden',
  },
  tint: {
    borderRadius: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    fontSize: 18,
    fontWeight: '600',
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});
