import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
  colorScheme: 'light' | 'dark';
};

/** Bottone: pieno a gradiente coral→violet per l'azione primaria (stesso linguaggio delle card CTA
 *  in Home/draw), outline sullo stesso colore per la secondaria. */
export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  colorScheme,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const pressed = useSharedValue(0);
  const colors = Colors[colorScheme];

  // Nessun transform a riposo: altrimenti il layer composito sfoca il testo su web (stesso motivo di useCardFlip).
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - pressed.value * 0.15,
    transform: pressed.value === 0 ? [] : [{ scale: 1 - pressed.value * 0.03 }],
  }));

  if (variant === 'secondary') {
    const outline = colors.titleColor;
    return (
      <Animated.View style={animatedStyle}>
        <Pressable
          style={[styles.button, styles.outline, { borderColor: outline }, isDisabled && styles.disabled]}
          onPress={onPress}
          onPressIn={() => (pressed.value = withTiming(1, { duration: 100 }))}
          onPressOut={() => (pressed.value = withTiming(0, { duration: 150 }))}
          disabled={isDisabled}
        >
          {loading ? (
            <ActivityIndicator color={outline} />
          ) : (
            <Text style={[styles.label, { color: outline }]}>{label}</Text>
          )}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[styles.button, isDisabled && styles.disabled]}
        onPress={onPress}
        onPressIn={() => (pressed.value = withTiming(1, { duration: 100 }))}
        onPressOut={() => (pressed.value = withTiming(0, { duration: 150 }))}
        disabled={isDisabled}
      >
        <LinearGradient
          colors={[colors.secondary, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {loading ? (
          <ActivityIndicator color={colors.border} />
        ) : (
          <Text style={[styles.label, { color: colors.border }]}>{label}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    overflow: 'hidden',
    boxShadow: `0px 8px 14px ${hexToRgba(Colors.light.primary, 0.3)}`,
  },
  outline: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
