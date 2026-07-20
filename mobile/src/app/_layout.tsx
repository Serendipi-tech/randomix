import { ApolloProvider } from '@apollo/client';
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

  useEffect(() => {
    const init = async () => {
      try {
        const token = await tokenStorage.init();

        if (!token) {
          router.replace('/(auth)/login');
          return;
        }

        router.replace('/(app)');
      } finally {
        SplashScreen.hideAsync();
      }
    };

    init();
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      <AppThemeProvider>
        <AuthIntroReplayProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
          <GlobalDevOverlay />
        </AuthIntroReplayProvider>
      </AppThemeProvider>
      <AnimatedSplashOverlay />
    </ApolloProvider>
  );
}
