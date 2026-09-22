import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Spazio fisso (altezza pillola-navbar di app-tabs.tsx + margine) da riservare sopra l'inset di
// sistema, così l'ultimo elemento di una lista non finisce sotto la navbar. Si regola qui, in un solo punto.
const NAVBAR_CLEARANCE = 100;

/** Spazio da riservare in fondo a una lista scrollabile: clearance fissa + inset di sistema reale.
 *  Da usare come `paddingBottom` del contentContainer, solo dove serve (opt-in). */
export function useNavbarClearance(): number {
  const insets = useSafeAreaInsets();
  return NAVBAR_CLEARANCE + insets.bottom;
}
