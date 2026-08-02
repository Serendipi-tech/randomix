import { Stack } from 'expo-router';

/** Stack della tab Home: index + dettaglio lista, form lista/item, sorteggio e randomizer.
 *  Le schermate si impilano qui dentro, così la navbar (renderizzata da AppTabs) resta sempre visibile. */
export default function HomeStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
