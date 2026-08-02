import { Stack } from 'expo-router';

/** Perimetro protetto dell'app: le tab (con i loro stack annidati: home/friends/groups + dettagli e form)
 *  tengono la navbar sempre visibile. Restano fuori solo le rotte davvero full-screen (es. showcase dev). */
export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="colors-showcase" />
    </Stack>
  );
}
