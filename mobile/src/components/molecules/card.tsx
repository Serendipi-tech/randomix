import { BlurView } from 'expo-blur';
import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { Colors, GradientBackground } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';

type CardProps = PropsWithChildren<{
  colorScheme: 'light' | 'dark';
  style?: ViewStyle;
}>;

/** Card glass riusabile: blur + tinta semi-trasparente, con ombra sul contenitore esterno.
 *  Il wrapper esterno resta trasparente apposta: un backgroundColor lì dietro verrebbe sfocato dal
 *  BlurView al posto dello sfondo vero, e il vetro sparirebbe in una tinta piatta.
 *  Il contenuto scrolla internamente: la dimensione della card (impostata da fuori via `style`) non cambia mai in base alla faccia mostrata. */
export function Card({ colorScheme, style, children }: CardProps) {
  const colors = Colors[colorScheme];
  const fill =
    colorScheme === 'light'
      ? hexToRgba(colors.primary, 0.3)
      : hexToRgba(GradientBackground.dark.stops[1], 0.58);
  const border = hexToRgba(colors.border, colorScheme === 'light' ? 0.5 : 0.16);

  return (
    <View style={[styles.shadowWrapper, style]}>
      <View style={[styles.clip, { borderColor: border }]}>
        {/* tint "default" invece di light/dark: quei due applicano un wash quasi opaco che desatura il colore sotto */}
        <BlurView intensity={60} tint="default" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: fill }]} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: 32,
    // shadow* è deprecato e non renderizza più: la nuova proprietà unificata è boxShadow.
    boxShadow: `0px 16px 28px ${hexToRgba(Colors.light.shadow, 0.35)}`,
    elevation: 16,
  },
  clip: {
    flex: 1,
    borderRadius: 32,
    borderWidth: 1,
    overflow: 'hidden',
  },
  // senza flex:1 qui lo ScrollView non riempie l'altezza fissa del clip: si dimensiona sul contenuto
  // e gli spacer flex:1 dentro le facce (usati per ancorare "back" in fondo) si espandono oltre il dovuto.
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    gap: 20,
    // flex-start (non center): il titolo deve stare sempre allo stesso punto in alto, a prescindere da quanto contenuto ha la faccia sotto.
    justifyContent: 'flex-start',
  },
});
