import { Stack } from 'expo-router';

/** Perimetro protetto dell'app: le tab (index/social/settings) più le schermate di dettaglio/form
 *  impilate sopra di esse. Stare tutti dentro (app) è ciò che le tiene fuori dalla portata di chi non è loggato. */
export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="draw" />
      <Stack.Screen name="item-form" />
      <Stack.Screen name="list-form" />
      <Stack.Screen name="randomizer" />
      <Stack.Screen name="friend/[id]" />
      <Stack.Screen name="list/[id]" />
      <Stack.Screen name="group/[id]" />
      <Stack.Screen name="group-list/[groupListId]" />
    </Stack>
  );
}
