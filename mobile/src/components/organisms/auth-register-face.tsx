import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AuthButton } from '@/components/atoms/auth-button';
import { AuthInput } from '@/components/atoms/auth-input';
import { Accent, AuthCardSurface } from '@/constants/theme';

type AuthRegisterFaceProps = {
  colorScheme: 'light' | 'dark';
  email: string;
  onEmailChange: (value: string) => void;
  username: string;
  onUsernameChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (value: string) => void;
  error: string | null;
  loading: boolean;
  onSubmit: () => void;
  onGoToLogin: () => void;
  onBack: () => void;
};

/** Faccia "register" della card: creazione account con credenziali. */
export function AuthRegisterFace({
  colorScheme,
  email,
  onEmailChange,
  username,
  onUsernameChange,
  password,
  onPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  error,
  loading,
  onSubmit,
  onGoToLogin,
  onBack,
}: AuthRegisterFaceProps) {
  const { t } = useTranslation('auth');
  const textColor = AuthCardSurface[colorScheme].text;

  return (
    <View style={styles.form}>
      <AuthInput
        colorScheme={colorScheme}
        placeholder={t('register.emailPlaceholder')}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={onEmailChange}
      />
      <AuthInput
        colorScheme={colorScheme}
        placeholder={t('register.usernamePlaceholder')}
        autoCapitalize="none"
        value={username}
        onChangeText={onUsernameChange}
      />
      <AuthInput
        colorScheme={colorScheme}
        placeholder={t('register.passwordPlaceholder')}
        secureTextEntry
        value={password}
        onChangeText={onPasswordChange}
      />
      <AuthInput
        colorScheme={colorScheme}
        placeholder={t('register.confirmPasswordPlaceholder')}
        secureTextEntry
        value={confirmPassword}
        onChangeText={onConfirmPasswordChange}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <AuthButton colorScheme={colorScheme} label={t('register.submit')} onPress={onSubmit} loading={loading} />

      <Pressable onPress={onGoToLogin} style={styles.link}>
        <Text style={styles.linkText}>{t('register.haveAccount')}</Text>
      </Pressable>

      <Pressable onPress={onBack} style={styles.link}>
        <Text style={[styles.backText, { color: textColor }]}>{t('register.back')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  error: { fontSize: 14, color: '#E53E3E', textAlign: 'center', fontFamily: 'Nunito_500Medium' },
  link: { alignItems: 'center', marginTop: 8 },
  linkText: { fontSize: 14, color: Accent.primary, fontFamily: 'Nunito_500Medium' },
  backText: { fontSize: 13, opacity: 0.6, fontFamily: 'Nunito_500Medium' },
});
