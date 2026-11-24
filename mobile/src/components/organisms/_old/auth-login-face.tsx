import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/atoms/Button';
import { Divider } from '@/components/atoms/Divider';
import { Input } from '@/components/molecules/Input';
import { Pressable } from 'react-native';
import { Colors } from '@/constants/theme';
import { Title } from '@/components/molecules/title';
import { FormError } from '@/components/molecules/form-error';

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
  const textColor = Colors[colorScheme].textColor;
  const linkColor = Colors[colorScheme].primary;

  return (
    <View style={styles.form}>
      <Title variant="lead-accent" lead={t('login.headline')} accent={t('login.brand')} colorScheme={colorScheme} />

      <Input
        placeholder={t('login.identifierPlaceholder')}
        autoCapitalize="none"
        value={identifier}
        onChangeText={onIdentifierChange}
      />
      <Input variant="password"
        placeholder={t('login.passwordPlaceholder')}
        value={password}
        onChangeText={onPasswordChange}
        showStrength={false}
      />

      <Pressable onPress={onGoToRecover} style={styles.forgotPassword}>
        <Text style={[styles.forgotPasswordText, { color: linkColor }]}>{t('login.forgotPassword')}</Text>
      </Pressable>

      {error && <FormError message={error} />}

      <Button label={t('login.submit')} onPress={onSubmit} loading={loading} />

      <Divider label={t('login.or')} />

      <Button
        variant="secondary"
        label={t('login.google')}
        onPress={onGoogle}
        disabled={loading}
      />

      <Pressable onPress={onGoToRegister} style={styles.link}>
        <Text style={[styles.linkText, { color: linkColor }]}>{t('login.noAccount')}</Text>
      </Pressable>

      <View style={styles.spacer} />

      <Pressable onPress={onBack} style={styles.link}>
        <Text style={[styles.backText, { color: textColor }]}>{t('login.back')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // flex:1 + spacer sotto: il bottone "back" resta ancorato in fondo alla card a prescindere dal contenuto sopra.
  // gap ridotto: questa faccia ha più contenuto (Google + divider) e deve rientrare nell'altezza fissa della card senza andare in scroll.
  form: { gap: 6, flex: 1 },
  spacer: { flex: 1 },
  forgotPassword: { alignSelf: 'flex-end', marginTop: -4 },
  forgotPasswordText: { fontSize: 15, fontWeight: '600' },
  link: { alignItems: 'center', marginTop: 8 },
  linkText: { fontSize: 15, fontWeight: '600' },
  backText: { fontSize: 15, opacity: 0.75 },
});
