import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AuthButton } from '@/components/atoms/auth-button';
import { AuthInput } from '@/components/atoms/auth-input';
import { AuthCardSurface } from '@/constants/theme';
import type { RecoveryStep } from '@/utils/usePasswordRecoveryForm';

type AuthRecoverFaceProps = {
  colorScheme: 'light' | 'dark';
  step: RecoveryStep;
  email: string;
  onEmailChange: (value: string) => void;
  otp: string;
  onOtpChange: (value: string) => void;
  newPassword: string;
  onNewPasswordChange: (value: string) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (value: string) => void;
  error: string | null;
  loading: boolean;
  onSubmitRequest: () => void;
  onSubmitConfirm: () => void;
  onBack: () => void;
};

/** Faccia "recover" della card: due step interni, richiesta codice e conferma nuova password. */
export function AuthRecoverFace({
  colorScheme,
  step,
  email,
  onEmailChange,
  otp,
  onOtpChange,
  newPassword,
  onNewPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  error,
  loading,
  onSubmitRequest,
  onSubmitConfirm,
  onBack,
}: AuthRecoverFaceProps) {
  const { t } = useTranslation('auth');
  const textColor = AuthCardSurface[colorScheme].text;

  if (step === 'request') {
    return (
      <View style={styles.form}>
        <Text style={[styles.tagline, { color: textColor }]}>{t('forgotPassword.tagline')}</Text>
        <AuthInput
          colorScheme={colorScheme}
          placeholder={t('forgotPassword.emailPlaceholder')}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={onEmailChange}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <AuthButton
          colorScheme={colorScheme}
          label={t('forgotPassword.submit')}
          onPress={onSubmitRequest}
          loading={loading}
        />

        <Pressable onPress={onBack} style={styles.link}>
          <Text style={[styles.backText, { color: textColor }]}>{t('forgotPassword.back')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.form}>
      <Text style={[styles.tagline, { color: textColor }]}>{t('resetPassword.tagline')}</Text>
      <AuthInput
        colorScheme={colorScheme}
        placeholder={t('resetPassword.otpPlaceholder')}
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={onOtpChange}
      />
      <AuthInput
        colorScheme={colorScheme}
        placeholder={t('resetPassword.newPasswordPlaceholder')}
        secureTextEntry
        value={newPassword}
        onChangeText={onNewPasswordChange}
      />
      <AuthInput
        colorScheme={colorScheme}
        placeholder={t('resetPassword.confirmPasswordPlaceholder')}
        secureTextEntry
        value={confirmPassword}
        onChangeText={onConfirmPasswordChange}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <AuthButton
        colorScheme={colorScheme}
        label={t('resetPassword.submit')}
        onPress={onSubmitConfirm}
        loading={loading}
      />

      <Pressable onPress={onBack} style={styles.link}>
        <Text style={[styles.backText, { color: textColor }]}>{t('resetPassword.back')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  tagline: { fontSize: 14, textAlign: 'center', fontFamily: 'Nunito_500Medium', opacity: 0.75 },
  error: { fontSize: 14, color: '#E53E3E', textAlign: 'center', fontFamily: 'Nunito_500Medium' },
  link: { alignItems: 'center', marginTop: 8 },
  backText: { fontSize: 13, opacity: 0.6, fontFamily: 'Nunito_500Medium' },
});
