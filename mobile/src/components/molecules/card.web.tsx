import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { CardSurface } from '@/constants/theme';

type CardProps = PropsWithChildren<{
  colorScheme: 'light' | 'dark';
  style?: ViewStyle;
}>;

/** Variante web: backdrop-filter CSS puro, senza il wash bianco/nero che expo-blur applica di suo sul web
 *  (schiarirebbe qualunque tinta ci mettessimo sopra). Il colore è interamente quello di CardSurface. */
export function Card({ colorScheme, style, children }: CardProps) {
  const surface = CardSurface[colorScheme];

  return (
    <View style={[styles.shadowWrapper, style]}>
      <View style={[styles.clip, { borderColor: surface.border }]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: surface.fill }, glassStyle]} />
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
