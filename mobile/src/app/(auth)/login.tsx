import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { Easing, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useAuth } from '@/utils/useAuth';
import { useAuthIntro } from '@/utils/useAuthIntro';
import { Accent, AuthBackground, AuthOnBackgroundText } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthButton } from '@/components/atoms/auth-button';
import { AuthDivider } from '@/components/atoms/auth-divider';
import { AuthInput } from '@/components/atoms/auth-input';
import { HighlightChip } from '@/components/atoms/highlight-chip';
import { RefreshButton } from '@/components/atoms/refresh-button';
import { StickerShape } from '@/components/atoms/sticker-shape';
import { AuthBackgroundView } from '@/components/molecules/auth-background';
import { AuthCard } from '@/components/molecules/auth-card';
import { DiceLogo } from '@/components/molecules/dice-logo';

const diceLayoutTransition = LinearTransition.duration(450).easing(Easing.out(Easing.cubic));

export default function LoginScreen() {
  const { t } = useTranslation('auth');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const router = useRouter();
  const { diceStyle, cardVisible, replay } = useAuthIntro();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const { loginWithCredentials, loginWithGoogle, loading, error } = useAuth();

  const [_request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        loginWithGoogle(idToken).catch((e: Error) => setLocalError(e.message));
      } else {
        setLocalError(t('login.googleTokenError'));
      }
    }
  }, [response]);

  const handleCredentialsLogin = async () => {
    setLocalError(null);
    if (!email.trim() || !password) {
      setLocalError(t('login.missingFields'));
      return;
    }
    try {
      await loginWithCredentials(email.trim(), password);
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  const displayError = localError ?? error?.message ?? null;
  const onBg = AuthOnBackgroundText[colorScheme];
  const s = styles(onBg);

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: AuthBackground[colorScheme].stops[0] }]}>
      <AuthBackgroundView colorScheme={colorScheme} />

      <RefreshButton onPress={replay} colorScheme={colorScheme} style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }} />

      <StickerShape variant="star" color={Accent.yellow} size={20} rotation={-12} style={{ position: 'absolute', top: 20, right: 28 }} />
      <StickerShape variant="dot" color={Accent.mint} size={12} style={{ position: 'absolute', bottom: 40, left: 24 }} />

      <KeyboardAvoidingView style={s.inner} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View layout={diceLayoutTransition}>
            <Animated.View style={diceStyle}>
              <DiceLogo />
            </Animated.View>
          </Animated.View>

          {cardVisible && (
            <Animated.View entering={FadeInDown.duration(500)}>
              <View style={s.headerText}>
                <Text style={s.headline}>{t('login.headline')}</Text>
                <HighlightChip label={t('login.brand')} color={Accent.yellow} fontSize={30} />
                <Text style={s.tagline}>{t('login.tagline')}</Text>
              </View>

              <AuthCard colorScheme={colorScheme}>
                <View style={s.form}>
                  <AuthInput
                    colorScheme={colorScheme}
                    placeholder={t('login.emailPlaceholder')}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />
                  <AuthInput
                    colorScheme={colorScheme}
                    placeholder={t('login.passwordPlaceholder')}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />

                  <Pressable onPress={() => {}} style={s.forgotPassword}>
                    <Text style={s.forgotPasswordText}>{t('login.forgotPassword')}</Text>
                  </Pressable>

                  {displayError && <Text style={s.error}>{displayError}</Text>}

                  <AuthButton
                    colorScheme={colorScheme}
                    label={t('login.submit')}
                    onPress={handleCredentialsLogin}
                    loading={loading}
                  />

                  <AuthDivider label={t('login.or')} colorScheme={colorScheme} />

                  <AuthButton
                    colorScheme={colorScheme}
                    variant="secondary"
                    label={t('login.google')}
                    onPress={() => promptAsync()}
                    disabled={loading}
                  />
                </View>
              </AuthCard>

              <Pressable onPress={() => router.push('/(auth)/register')} style={s.registerLink}>
                <Text style={s.registerLinkText}>{t('login.noAccount')}</Text>
              </Pressable>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = (onBg: typeof AuthOnBackgroundText.light | typeof AuthOnBackgroundText.dark) =>
  StyleSheet.create({
    safe: {
      flex: 1,
    },
    inner: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingVertical: 32,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 20,
    },
    headerText: {
      alignItems: 'center',
      gap: 6,
      marginBottom: 20,
    },
    headline: {
      fontSize: 24,
      textAlign: 'center',
      color: onBg.primary,
      fontFamily: 'Fredoka_700Bold',
    },
    tagline: {
      fontSize: 15,
      color: onBg.secondary,
      fontFamily: 'Nunito_500Medium',
      marginTop: 4,
      textAlign: 'center',
      paddingHorizontal: 12,
    },
    form: {
      gap: 12,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginTop: -4,
    },
    forgotPasswordText: {
      fontSize: 13,
      color: Accent.primary,
      fontFamily: 'Nunito_500Medium',
    },
    error: {
      fontSize: 14,
      color: '#E53E3E',
      textAlign: 'center',
      fontFamily: 'Nunito_500Medium',
    },
    registerLink: {
      alignItems: 'center',
      marginTop: 20,
    },
    registerLinkText: {
      fontSize: 14,
      color: onBg.secondary,
      fontFamily: 'Nunito_500Medium',
    },
  });
