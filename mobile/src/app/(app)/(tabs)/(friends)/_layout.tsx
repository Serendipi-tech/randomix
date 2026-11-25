import { useEffect } from 'react';
import { Stack, useNavigation, useRouter } from 'expo-router';

// expo-router/ui non tipizza l'evento "tabPress" emesso dalla pillola custom in app-tabs.tsx:
// qui dichiariamo solo la forma minima che usiamo, invece di un cast ad `any`.
type FriendsTabNavigation = {
  addListener: (event: 'tabPress', callback: () => void) => () => void;
  isFocused: () => boolean;
};

/** Stack della tab Amici: elenco amici + dettaglio amico, con navbar sempre visibile. */
export default function FriendsStackLayout() {
  const navigation = useNavigation<FriendsTabNavigation>();
  const router = useRouter();

  useEffect(() => {
    // La pillola emette "tabPress" ad ogni tocco, anche se la tab è già attiva
    // (in quel caso non naviga da sola): qui intercettiamo il ri-tap per
    // riportare lo stack interno alla lista amici (pop to top).
    return navigation.addListener('tabPress', () => {
      if (navigation.isFocused()) {
        router.dismissAll();
      }
    });
  }, [navigation, router]);

  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} />;
}
