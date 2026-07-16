import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function ResetPasswordScreen() {
  const { t } = useTranslation('auth');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { diceStyle, blockStyle, onDiceLayout, onBlockLayout, replay } = useAuthIntro();

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const { confirmReset, loading } = usePasswordReset();

  const handleSubmit = async () => {
    setLocalError(null);

    if (!otp.trim() || !newPassword || !confirmPassword) {
      setLocalError(t('resetPassword.missingFields'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError(t('resetPassword.passwordMismatch'));
      return;
    }
    if (newPassword.length < 8) {
      setLocalError(t('resetPassword.passwordTooShort'));
      return;
    }

    try {
      await confirmReset(email ?? '', otp.trim(), newPassword);
      router.replace('/(auth)/login');
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

      <StickerShape variant="star" color={Accent.mint} size={20} rotation={-10} style={{ position: 'absolute', top: 20, right: 28 }} />
      <StickerShape variant="dot" color={Accent.primary} size={12} style={{ position: 'absolute', bottom: 40, left: 24 }} />

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
              <Text style={s.headline}>{t('resetPassword.headline')}</Text>
              <HighlightChip label={t('resetPassword.brand')} color={Accent.mint} fontSize={30} />
              <Text style={s.tagline}>{t('resetPassword.tagline')}</Text>
            </View>

            <AuthCard colorScheme={colorScheme}>
              <View style={s.form}>
                <AuthInput
                  colorScheme={colorScheme}
                  placeholder={t('resetPassword.otpPlaceholder')}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={setOtp}
                />
                <AuthInput
                  colorScheme={colorScheme}
                  placeholder={t('resetPassword.newPasswordPlaceholder')}
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <AuthInput
                  colorScheme={colorScheme}
                  placeholder={t('resetPassword.confirmPasswordPlaceholder')}
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />

                {localError && <Text style={s.error}>{localError}</Text>}

                <AuthButton
                  colorScheme={colorScheme}
                  label={t('resetPassword.submit')}
                  onPress={handleSubmit}
                  loading={loading}
                />
              </View>
            </AuthCard>

            <Pressable onPress={() => router.replace('/(auth)/login')} style={s.backLink}>
              <Text style={s.backLinkText}>{t('resetPassword.backToLogin')}</Text>
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
