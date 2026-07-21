import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { CardSurface } from '@/constants/theme';

type CardProps = PropsWithChildren<{
  colorScheme: 'light' | 'dark';
  style?: ViewStyle;
}>;

/** Variante web: backdrop-filter CSS puro, senza il wash bianco/nero che expo-blur applica di suo sul web
 *  (schiarirebbe qualunque tinta ci mettessimo sopra). Il colore è interamente quello di CardSurface.
 *  Il contenuto scrolla internamente: la dimensione della card (impostata da fuori via `style`) non cambia mai in base alla faccia mostrata. */
export function Card({ colorScheme, style, children }: CardProps) {
  const surface = CardSurface[colorScheme];

  return (
    <View style={[styles.shadowWrapper, style]}>
      <View style={[styles.clip, { borderColor: surface.border }]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: surface.fill }, glassStyle]} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
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
