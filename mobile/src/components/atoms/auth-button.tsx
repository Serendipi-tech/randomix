import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Accent, AuthButtonSecondary } from '@/constants/theme';

type AuthButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
  colorScheme: 'light' | 'dark';
};

/** Bottone per azioni di autenticazione (accedi, registrati, continua con Google), con "press" elastico. */
export function AuthButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  colorScheme,
}: AuthButtonProps) {
  const secondary = AuthButtonSecondary[colorScheme];
  const isDisabled = disabled || loading;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const textColor = variant === 'primary' ? '#fff' : secondary.text;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[
          styles.button,
          variant === 'primary' ? styles.primaryShadow : { backgroundColor: secondary.fill },
          isDisabled && styles.disabled,
        ]}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 12, stiffness: 220 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 10, stiffness: 200 });
        }}
        disabled={isDisabled}
      >
        {variant === 'primary' && (
          <LinearGradient
            colors={[Accent.primary, Accent.violet]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  primaryShadow: {
    shadowColor: Accent.violet,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Fredoka_600SemiBold',
  },
});
