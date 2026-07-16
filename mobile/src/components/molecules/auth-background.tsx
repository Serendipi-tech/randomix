import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { AuthBackground, AuthGlow } from '@/constants/theme';

type AuthBackgroundProps = {
  colorScheme: 'light' | 'dark';
};

const GLOW_SIZE = 260;

/** Sfondo pieno a gradiente multi-tono con macchie di luce, per dare profondità senza illustrazioni. */
export function AuthBackgroundView({ colorScheme }: AuthBackgroundProps) {
  const { stops } = AuthBackground[colorScheme];
  const glows = AuthGlow[colorScheme];

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient colors={stops} start={{ x: 0, y: 0 }} end={{ x: 0.7, y: 1 }} style={StyleSheet.absoluteFill} />
      {glows.map((glow, i) => (
        <LinearGradient
          key={i}
          colors={[glow.color, `${glow.color}00`]}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.glow,
            {
              top: 'top' in glow ? glow.top : undefined,
              bottom: 'bottom' in glow ? glow.bottom : undefined,
              left: 'left' in glow ? glow.left : undefined,
              right: 'right' in glow ? glow.right : undefined,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
    opacity: 0.35,
  },
});
