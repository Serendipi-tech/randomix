import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { AuthCardSurface } from '@/constants/theme';

type AuthCardProps = PropsWithChildren<{
  colorScheme: 'light' | 'dark';
  style?: ViewStyle;
}>;

/** Variante web: backdrop-filter CSS puro, senza il wash bianco/nero che expo-blur applica di suo sul web
 *  (schiarirebbe qualunque tinta ci mettessimo sopra). Il colore è interamente quello di AuthCardSurface. */
export function AuthCard({ colorScheme, style, children }: AuthCardProps) {
  const surface = AuthCardSurface[colorScheme];

  return (
    <View style={[styles.shadowWrapper, style]}>
      <View style={[styles.clip, { backgroundColor: surface.fill, borderColor: surface.border }, glassStyle]}>
        {children}
      </View>
    </View>
  );
}

const glassStyle = {
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
} as ViewStyle;

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: 32,
    boxShadow: '0px 16px 28px rgba(0,0,0,0.35)',
  },
  clip: {
    flex: 1,
    borderRadius: 32,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 24,
    gap: 20,
    justifyContent: 'center',
  },
});
