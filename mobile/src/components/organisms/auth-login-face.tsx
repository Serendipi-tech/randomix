import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/atoms/button';
import { Divider } from '@/components/atoms/divider';
import { Input } from '@/components/atoms/input';
import { Pressable } from 'react-native';
import { Accent, CardSurface } from '@/constants/theme';

type AuthLoginFaceProps = {
  colorScheme: 'light' | 'dark';
  identifier: string;
  onIdentifierChange: (value: string) => void;
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
  identifier,
  onIdentifierChange,
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
  const textColor = CardSurface[colorScheme].text;

  return (
    <View style={styles.form}>
      <Input
        colorScheme={colorScheme}
        placeholder={t('login.identifierPlaceholder')}
        autoCapitalize="none"
        value={identifier}
        onChangeText={onIdentifierChange}
      />
      <Input
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

      <Button colorScheme={colorScheme} label={t('login.submit')} onPress={onSubmit} loading={loading} />

      <Divider label={t('login.or')} colorScheme={colorScheme} />

      <Button
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
  forgotPasswordText: { fontSize: 13, color: Accent.primary },
  error: { fontSize: 14, color: '#E53E3E', textAlign: 'center' },
  link: { alignItems: 'center', marginTop: 8 },
  linkText: { fontSize: 14, color: Accent.primary },
  backText: { fontSize: 13, opacity: 0.6 },
});
