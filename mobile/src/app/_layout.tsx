import { ApolloProvider } from '@apollo/client';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { apolloClient } from '@/lib/apollo';
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
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(app)" />
      </Stack>
      <AnimatedSplashOverlay />
    </ApolloProvider>
  );
}
