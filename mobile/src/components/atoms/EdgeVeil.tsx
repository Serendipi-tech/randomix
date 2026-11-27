import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { hexToRgba } from '@/utils/color';

// `end` è la quota di larghezza su cui il velo si spegne, espressa come posizione dello stop
// (non come punto finale dell'asse, che lascerebbe il colore finale a proseguire)
const DEFAULT_ALPHA = 0.22;
const DEFAULT_END = 0.1;

type EdgeVeilProps = {
  color: string;
  /** Opacità al bordo sinistro. Default 0.22. */
  alpha?: number;
  /** Quota di larghezza su cui si spegne. Default 0.1. */
  end?: number;
};

/** Bagliore sul bordo sinistro di una card: velo di colore che si spegne subito verso destra.
 *  Va messo come figlio di un contenitore che lo ritagli (overflow: hidden). */
export function EdgeVeil({ color, alpha = DEFAULT_ALPHA, end = DEFAULT_END }: EdgeVeilProps) {
  return (
    <LinearGradient
      colors={[hexToRgba(color, alpha), hexToRgba(color, 0), hexToRgba(color, 0)]}
      locations={[0, end, 1]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />
  );
}
