import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { PasswordInput } from '@/components/atoms/password-input';
import { Colors } from '@/constants/theme';
import { Title } from '@/components/molecules/title';
import { FormError } from '@/components/molecules/form-error';
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
  const textColor = Colors[colorScheme].titleColor;

  if (step === 'request') {
    return (
      <View style={styles.form}>
        <Title variant="lead-accent" lead={t('forgotPassword.headline')} accent={t('forgotPassword.brand')} colorScheme={colorScheme} />
        <Text style={[styles.tagline, { color: textColor }]}>{t('forgotPassword.tagline')}</Text>
        <Input
          colorScheme={colorScheme}
          placeholder={t('forgotPassword.emailPlaceholder')}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={onEmailChange}
        />

        {error && <FormError message={error} />}

        <Button
          colorScheme={colorScheme}
          label={t('forgotPassword.submit')}
          onPress={onSubmitRequest}
          loading={loading}
        />

        <View style={styles.spacer} />

        <Pressable onPress={onBack} style={styles.link}>
          <Text style={[styles.backText, { color: textColor }]}>{t('forgotPassword.back')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.form}>
      <Title variant="lead-accent" lead={t('resetPassword.headline')} accent={t('resetPassword.brand')} colorScheme={colorScheme} />
      <Text style={[styles.tagline, { color: textColor }]}>{t('resetPassword.tagline')}</Text>
      <Input
        colorScheme={colorScheme}
        placeholder={t('resetPassword.otpPlaceholder')}
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={onOtpChange}
      />
      <PasswordInput
        colorScheme={colorScheme}
        placeholder={t('resetPassword.newPasswordPlaceholder')}
        value={newPassword}
        onChangeText={onNewPasswordChange}
        showStrength
      />
      <PasswordInput
        colorScheme={colorScheme}
        placeholder={t('resetPassword.confirmPasswordPlaceholder')}
        value={confirmPassword}
        onChangeText={onConfirmPasswordChange}
      />

      {error && <FormError message={error} />}

      <Button
        colorScheme={colorScheme}
        label={t('resetPassword.submit')}
        onPress={onSubmitConfirm}
        loading={loading}
      />

      <View style={styles.spacer} />

      <Pressable onPress={onBack} style={styles.link}>
        <Text style={[styles.backText, { color: textColor }]}>{t('resetPassword.back')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // flex:1 + spacer sotto: il bottone "back" resta ancorato in fondo alla card a prescindere dal contenuto sopra.
  // stesso gap ridotto delle altre facce, per coerenza di spaziatura tra tutte le visuali.
  form: { gap: 6, flex: 1 },
  spacer: { flex: 1 },
  tagline: { fontSize: 14, textAlign: 'center', opacity: 0.75 },
  link: { alignItems: 'center', marginTop: 8 },
  backText: { fontSize: 15, opacity: 0.75 },
});
