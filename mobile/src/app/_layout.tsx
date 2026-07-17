import { ApolloProvider } from '@apollo/client';
import { Nunito_500Medium, Nunito_700Bold, useFonts as useNunitoFonts } from '@expo-google-fonts/nunito';
import { Fredoka_600SemiBold, Fredoka_700Bold, useFonts as useFredokaFonts } from '@expo-google-fonts/fredoka';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { GlobalDevOverlay } from '@/components/organisms/global-dev-overlay';
import { apolloClient } from '@/lib/apollo';
import '@/lib/i18n';
import { AppThemeProvider } from '@/utils/useAppTheme';
import { AuthIntroReplayProvider } from '@/utils/useAuthIntroReplay';
import { tokenStorage } from '@/utils/tokenStorage';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [fredokaLoaded] = useFredokaFonts({ Fredoka_600SemiBold, Fredoka_700Bold });
  const [nunitoLoaded] = useNunitoFonts({ Nunito_500Medium, Nunito_700Bold });
  const fontsLoaded = fredokaLoaded && nunitoLoaded;

  useEffect(() => {
    if (!fontsLoaded) return;

    const init = async () => {
      try {
        const token = await tokenStorage.init();

        if (!token) {
          router.replace('/(auth)/login');
          return;
        }

        const hasConsent = await tokenStorage.hasEmailConsent();
        if (!hasConsent) {
          router.replace('/(onboarding)/consent');
          return;
        }

        router.replace('/(app)');
      } finally {
        SplashScreen.hideAsync();
      }
    };

    init();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ApolloProvider client={apolloClient}>
      <AppThemeProvider>
        <AuthIntroReplayProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(app)" />
          </Stack>
          <GlobalDevOverlay />
        </AuthIntroReplayProvider>
      </AppThemeProvider>
      <AnimatedSplashOverlay />
    </ApolloProvider>
  );
}
