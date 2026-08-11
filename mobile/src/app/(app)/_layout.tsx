import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';

/** Perimetro protetto dell'app: le tab (con i loro stack annidati: home/friends/groups + dettagli e form)
 *  tengono la navbar sempre visibile. Restano fuori solo le rotte davvero full-screen (es. showcase dev).
 *  Lo sfondo è qui, a tutto schermo dietro tutto (anche sotto la status bar): i navigatori sono trasparenti
 *  così scorre in ogni pagina senza barre di sistema opache. */
export default function AppLayout() {
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';

  return (
    <View style={styles.root}>
      <RadialBackground colorScheme={colorScheme} />
      <Stack screenOptions={{ headerShown: false, contentStyle: styles.transparent }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="colors-showcase" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  transparent: { backgroundColor: 'transparent' },
});
