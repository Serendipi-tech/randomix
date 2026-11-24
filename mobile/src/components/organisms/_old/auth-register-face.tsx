import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/molecules/Input';
import { Colors } from '@/constants/theme';
import { Title } from '@/components/molecules/title';
import { FormError } from '@/components/molecules/form-error';

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
  const textColor = Colors[colorScheme].textColor;
  const linkColor = Colors[colorScheme].primary;

  return (
    <View style={styles.form}>
      <Title variant="lead-accent" lead={t('register.headline')} accent={t('register.brand')} colorScheme={colorScheme} />

      <Input
        placeholder={t('register.emailPlaceholder')}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={onEmailChange}
      />
      <Input
        placeholder={t('register.usernamePlaceholder')}
        autoCapitalize="none"
        value={username}
        onChangeText={onUsernameChange}
      />
      <Input variant="password"
        placeholder={t('register.passwordPlaceholder')}
        value={password}
        onChangeText={onPasswordChange}
        showStrength
      />
      <Input variant="password"
        placeholder={t('register.confirmPasswordPlaceholder')}
        value={confirmPassword}
        onChangeText={onConfirmPasswordChange}
        showStrength={false}
      />

      {error && <FormError message={error} />}

      <Button label={t('register.submit')} onPress={onSubmit} loading={loading} />

      <Pressable onPress={onGoToLogin} style={styles.link}>
        <Text style={[styles.linkText, { color: linkColor }]}>{t('register.haveAccount')}</Text>
      </Pressable>

      <View style={styles.spacer} />

      <Pressable onPress={onBack} style={styles.link}>
        <Text style={[styles.backText, { color: textColor }]}>{t('register.back')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // flex:1 + spacer sotto: il bottone "back" resta ancorato in fondo alla card a prescindere dal contenuto sopra.
  // gap ridotto: 4 campi devono rientrare nell'altezza fissa della card senza andare in scroll.
  form: { gap: 6, flex: 1 },
  spacer: { flex: 1 },
  link: { alignItems: 'center', marginTop: 8 },
  linkText: { fontSize: 15, fontWeight: '600' },
  backText: { fontSize: 15, opacity: 0.75 },
});
