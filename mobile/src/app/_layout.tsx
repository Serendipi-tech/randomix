import { ApolloProvider } from '@apollo/client';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/nunito';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { apolloClient } from '@/lib/apollo';
import '@/lib/i18n';
import { AppThemeProvider } from '@/utils/useAppTheme';
import { AuthIntroReplayProvider } from '@/utils/useAuthIntroReplay';
import { ToastProvider } from '@/utils/useToast';
import { tokenStorage } from '@/utils/tokenStorage';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Nunito_400Regular, Nunito_600SemiBold, Nunito_800ExtraBold });
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await tokenStorage.init();

        if (!token) {
          router.replace('/(auth)/onboarding');
          return;
        }

        router.replace('/(app)/(tabs)/(home)');
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
