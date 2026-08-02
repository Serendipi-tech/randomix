import { Stack } from 'expo-router';

/** Stack della tab Gruppi: elenco gruppi + dettaglio gruppo e group-list, con navbar sempre visibile. */
export default function GroupsStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
