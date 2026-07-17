import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AuthButton } from '@/components/atoms/auth-button';
import { AuthDivider } from '@/components/atoms/auth-divider';
import { AuthInput } from '@/components/atoms/auth-input';
import { Pressable } from 'react-native';
import { Accent, AuthCardSurface } from '@/constants/theme';

type AuthLoginFaceProps = {
  colorScheme: 'light' | 'dark';
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  error: string | null;
  loading: boolean;
  onSubmit: () => void;
  onGoogle: () => void;
  onGoToRegister: () => void;
  onGoToRecover: () => void;
  onBack: () => void;
};

/** Faccia "login" della card: credenziali + accesso Google. */
export function AuthLoginFace({
  colorScheme,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  error,
  loading,
  onSubmit,
  onGoogle,
  onGoToRegister,
  onGoToRecover,
  onBack,
}: AuthLoginFaceProps) {
  const { t } = useTranslation('auth');
  const textColor = AuthCardSurface[colorScheme].text;

  return (
    <View style={styles.form}>
      <AuthInput
        colorScheme={colorScheme}
        placeholder={t('login.emailPlaceholder')}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={onEmailChange}
      />
      <AuthInput
        colorScheme={colorScheme}
        placeholder={t('login.passwordPlaceholder')}
        secureTextEntry
        value={password}
        onChangeText={onPasswordChange}
      />

      <Pressable onPress={onGoToRecover} style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>{t('login.forgotPassword')}</Text>
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}

      <AuthButton colorScheme={colorScheme} label={t('login.submit')} onPress={onSubmit} loading={loading} />

      <AuthDivider label={t('login.or')} colorScheme={colorScheme} />

      <AuthButton
        colorScheme={colorScheme}
        variant="secondary"
        label={t('login.google')}
        onPress={onGoogle}
        disabled={loading}
      />

      <Pressable onPress={onGoToRegister} style={styles.link}>
        <Text style={styles.linkText}>{t('login.noAccount')}</Text>
      </Pressable>

      <Pressable onPress={onBack} style={styles.link}>
        <Text style={[styles.backText, { color: textColor }]}>{t('login.back')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  forgotPassword: { alignSelf: 'flex-end', marginTop: -4 },
  forgotPasswordText: { fontSize: 13, color: Accent.primary, fontFamily: 'Nunito_500Medium' },
  error: { fontSize: 14, color: '#E53E3E', textAlign: 'center', fontFamily: 'Nunito_500Medium' },
  link: { alignItems: 'center', marginTop: 8 },
  linkText: { fontSize: 14, color: Accent.primary, fontFamily: 'Nunito_500Medium' },
  backText: { fontSize: 13, opacity: 0.6, fontFamily: 'Nunito_500Medium' },
});
