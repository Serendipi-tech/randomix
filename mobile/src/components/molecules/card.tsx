import { BlurView } from 'expo-blur';
import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { CardSurface } from '@/constants/theme';

type CardProps = PropsWithChildren<{
  colorScheme: 'light' | 'dark';
  style?: ViewStyle;
}>;

/** Card glass riusabile: blur + tinta semi-trasparente, con ombra sul contenitore esterno.
 *  Il wrapper esterno resta trasparente apposta: un backgroundColor lì dietro verrebbe sfocato dal
 *  BlurView al posto dello sfondo vero, e il vetro sparirebbe in una tinta piatta. */
export function Card({ colorScheme, style, children }: CardProps) {
  const surface = CardSurface[colorScheme];

  return (
    <View style={[styles.shadowWrapper, style]}>
      <View style={[styles.clip, { borderColor: surface.border }]}>
        {/* tint "default" invece di light/dark: quei due applicano un wash quasi opaco che desatura il colore sotto */}
        <BlurView intensity={60} tint="default" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: surface.fill }]} />
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: 32,
    // shadow* è deprecato e non renderizza più: la nuova proprietà unificata è boxShadow.
    boxShadow: '0px 16px 28px rgba(0,0,0,0.35)',
    elevation: 16,
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
