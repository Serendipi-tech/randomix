import { StyleSheet } from 'react-native';
import { RefreshButton } from '@/components/atoms/refresh-button';
import { ThemeToggleButton } from '@/components/atoms/theme-toggle-button';
import { useAppTheme } from '@/utils/useAppTheme';
import { useAuthIntroReplay } from '@/utils/useAuthIntroReplay';

/** Overlay persistente sopra qualunque schermata: unico punto in cui aggiungere/rimuovere i controlli globali di sviluppo. */
export function GlobalDevOverlay() {
  const { colorScheme, toggleColorScheme } = useAppTheme();
  const { replay } = useAuthIntroReplay();

  return (
    <>
      <RefreshButton onPress={replay} colorScheme={colorScheme} style={styles.left} />
      <ThemeToggleButton onPress={toggleColorScheme} colorScheme={colorScheme} style={styles.right} />
    </>
  );
}

const styles = StyleSheet.create({
  left: { position: 'absolute', top: 60, left: 16, zIndex: 100 },
  right: { position: 'absolute', top: 60, right: 16, zIndex: 100 },
});
