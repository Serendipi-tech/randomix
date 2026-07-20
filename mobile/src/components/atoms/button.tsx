import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ButtonPrimary, ButtonSecondary } from '@/constants/theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
  colorScheme: 'light' | 'dark';
};

/** Bottone piatto a un colore: pieno per l'azione primaria, outline sullo stesso colore per la secondaria. */
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

  // Nessun transform a riposo: altrimenti il layer composito sfoca il testo su web (stesso motivo di useCardFlip).
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - pressed.value * 0.15,
    transform: pressed.value === 0 ? [] : [{ scale: 1 - pressed.value * 0.03 }],
  }));

  if (variant === 'secondary') {
    const outline = ButtonSecondary[colorScheme];
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
        style={[styles.button, styles.filled, isDisabled && styles.disabled]}
        onPress={onPress}
        onPressIn={() => (pressed.value = withTiming(1, { duration: 100 }))}
        onPressOut={() => (pressed.value = withTiming(0, { duration: 150 }))}
        disabled={isDisabled}
      >
        {loading ? (
          <ActivityIndicator color={ButtonPrimary.text} />
        ) : (
          <Text style={[styles.label, { color: ButtonPrimary.text }]}>{label}</Text>
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
    backgroundColor: ButtonPrimary.fill,
    // niente gradiente/overflow: un layer semi-trasparente/tagliato in meno dentro la card con backdrop-filter
    boxShadow: '0px 8px 14px rgba(124,92,252,0.3)',
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
  },
});
