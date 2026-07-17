import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { AuthButtonPrimary, AuthButtonSecondary } from '@/constants/theme';

type AuthButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
  colorScheme: 'light' | 'dark';
};

/** Bottone piatto a un colore: pieno per l'azione primaria, outline sullo stesso colore per la secondaria. */
export function AuthButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  colorScheme,
}: AuthButtonProps) {
  const isDisabled = disabled || loading;
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - pressed.value * 0.15,
    transform: [{ scale: 1 - pressed.value * 0.03 }],
  }));

  if (variant === 'secondary') {
    const outline = AuthButtonSecondary[colorScheme];
    return (
      <Animated.View style={animatedStyle}>
        <Pressable
          style={[styles.button, styles.outline, { borderColor: outline.border }, isDisabled && styles.disabled]}
          onPress={onPress}
          onPressIn={() => (pressed.value = withTiming(1, { duration: 100 }))}
          onPressOut={() => (pressed.value = withTiming(0, { duration: 150 }))}
          disabled={isDisabled}
        >
          {loading ? (
            <ActivityIndicator color={outline.text} />
          ) : (
            <Text style={[styles.label, { color: outline.text }]}>{label}</Text>
          )}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[styles.button, styles.filled, { backgroundColor: AuthButtonPrimary.fill }, isDisabled && styles.disabled]}
        onPress={onPress}
        onPressIn={() => (pressed.value = withTiming(1, { duration: 100 }))}
        onPressOut={() => (pressed.value = withTiming(0, { duration: 150 }))}
        disabled={isDisabled}
      >
        {loading ? (
          <ActivityIndicator color={AuthButtonPrimary.text} />
        ) : (
          <Text style={[styles.label, { color: AuthButtonPrimary.text }]}>{label}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  filled: {
    boxShadow: '0px 6px 16px rgba(124,92,252,0.35)',
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
    fontFamily: 'Fredoka_600SemiBold',
  },
});
