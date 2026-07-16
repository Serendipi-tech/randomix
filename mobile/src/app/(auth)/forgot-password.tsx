import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { Accent, AuthBackground, AuthOnBackgroundText } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePasswordReset } from '@/utils/usePasswordReset';
import { useAuthIntro } from '@/utils/useAuthIntro';
import { AuthButton } from '@/components/atoms/auth-button';
import { AuthInput } from '@/components/atoms/auth-input';
import { HighlightChip } from '@/components/atoms/highlight-chip';
import { RefreshButton } from '@/components/atoms/refresh-button';
import { StickerShape } from '@/components/atoms/sticker-shape';
import { AuthBackgroundView } from '@/components/molecules/auth-background';
import { AuthCard } from '@/components/molecules/auth-card';
import { DiceLogo } from '@/components/molecules/dice-logo';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation('auth');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const router = useRouter();
  const { diceStyle, blockStyle, onDiceLayout, onBlockLayout, replay } = useAuthIntro();

  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const { requestReset, loading } = usePasswordReset();

  const handleSubmit = async () => {
    setLocalError(null);
    if (!email.trim()) {
      setLocalError(t('forgotPassword.missingEmail'));
      return;
    }
    try {
      await requestReset(email.trim());
      router.push({ pathname: '/(auth)/reset-password', params: { email: email.trim() } });
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  const onBg = AuthOnBackgroundText[colorScheme];
  const s = styles(onBg);

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: AuthBackground[colorScheme].stops[0] }]}>
      <AuthBackgroundView colorScheme={colorScheme} />

      <RefreshButton onPress={replay} colorScheme={colorScheme} style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }} />

      <StickerShape variant="star" color={Accent.primary} size={20} rotation={15} style={{ position: 'absolute', top: 20, right: 28 }} />
      <StickerShape variant="dot" color={Accent.yellow} size={12} style={{ position: 'absolute', bottom: 40, left: 24 }} />

      <KeyboardAvoidingView style={s.inner} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.diceZone}>
          <View onLayout={onDiceLayout}>
            <Animated.View style={diceStyle}>
              <DiceLogo />
            </Animated.View>
          </View>
        </View>

        <View style={s.block} onLayout={onBlockLayout}>
          <Animated.View style={blockStyle}>
            <View style={s.headerText}>
              <Text style={s.headline}>{t('forgotPassword.headline')}</Text>
              <HighlightChip label={t('forgotPassword.brand')} color={Accent.primary} fontSize={30} />
              <Text style={s.tagline}>{t('forgotPassword.tagline')}</Text>
            </View>

            <AuthCard colorScheme={colorScheme}>
              <View style={s.form}>
                <AuthInput
                  colorScheme={colorScheme}
                  placeholder={t('forgotPassword.emailPlaceholder')}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />

                {localError && <Text style={s.error}>{localError}</Text>}

                <AuthButton
                  colorScheme={colorScheme}
                  label={t('forgotPassword.submit')}
                  onPress={handleSubmit}
                  loading={loading}
                />
              </View>
            </AuthCard>

            <Pressable onPress={() => router.back()} style={s.backLink}>
              <Text style={s.backLinkText}>{t('forgotPassword.backToLogin')}</Text>
            </Pressable>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = (onBg: typeof AuthOnBackgroundText.light | typeof AuthOnBackgroundText.dark) =>
  StyleSheet.create({
    safe: { flex: 1 },
    inner: { flex: 1 },
    diceZone: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    block: { position: 'absolute', left: 24, right: 24, bottom: 28 },
    headerText: { alignItems: 'center', gap: 6, marginBottom: 20 },
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
    form: { gap: 12 },
    error: {
      fontSize: 14,
      color: '#E53E3E',
      textAlign: 'center',
      fontFamily: 'Nunito_500Medium',
    },
    backLink: { alignItems: 'center', marginTop: 20 },
    backLinkText: {
      fontSize: 14,
      color: onBg.secondary,
      fontFamily: 'Nunito_500Medium',
    },
  });
