import { ApolloProvider } from '@apollo/client';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/nunito';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { apolloClient } from '@/lib/apollo';
import '@/lib/i18n';
import { AppThemeProvider } from '@/utils/useAppTheme';
import { AuthIntroReplayProvider } from '@/utils/useAuthIntroReplay';
import { ToastProvider } from '@/utils/useToast';
import { tokenStorage } from '@/utils/tokenStorage';
import { prefetchMyPlan } from '@/utils/useMyPlan';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Nunito_400Regular, Nunito_600SemiBold, Nunito_800ExtraBold });
  const [authReady, setAuthReady] = useState(false);

  // Rotta di partenza (su web: quella dell'URL ricaricato). In un ref perché l'avvio deve
  // guardarla una volta sola, senza ripartire a ogni navigazione successiva.
  const segments = useSegments();
  const initialSegments = useRef(segments);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await tokenStorage.init();
        const [area] = initialSegments.current;

        if (!token) {
          if (area !== '(auth)') router.replace('/(auth)/onboarding');
          return;
        }

        // Sessione ripresa senza passare dal login: il piano va caricato anche qui
        await prefetchMyPlan();
        // Si entra in home solo arrivando da fuori (radice o schermate di accesso): con un
        // indirizzo già dentro l'app si resta dov'è l'utente, altrimenti ogni ricarica della
        // pagina su web lo riporterebbe in home.
        if (area !== '(app)') router.replace('/(app)/(tabs)/(home)');
      } finally {
        setAuthReady(true);
      }
    };

    init();
  }, []);

  // Lo splash resta finché auth e font non sono pronti: così nessuna schermata appare con il font di fallback
  useEffect(() => {
    if (authReady && fontsLoaded) SplashScreen.hideAsync();
  }, [authReady, fontsLoaded]);

  return (
    <ApolloProvider client={apolloClient}>
      <AppThemeProvider>
        <ToastProvider>
          <AuthIntroReplayProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(app)" />
            </Stack>
          </AuthIntroReplayProvider>
        </ToastProvider>
      </AppThemeProvider>
      <AnimatedSplashOverlay />
    </ApolloProvider>
  );
}
