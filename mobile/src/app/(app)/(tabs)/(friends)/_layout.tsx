import { Stack } from 'expo-router';

/** Stack della tab Amici: elenco amici + dettaglio amico, con navbar sempre visibile. */
export default function FriendsStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
