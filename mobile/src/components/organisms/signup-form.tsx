import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/molecules/Input';
import { Title } from '@/components/molecules/title';
import { FormError } from '@/components/molecules/form-error';

type SignupFormProps = {
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
  canSubmit: boolean;
  onSubmit: () => void;
};

/** Contenuto della bottomsheet di registrazione: credenziali + submit. */
export function SignupForm({
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
  canSubmit,
  onSubmit,
}: SignupFormProps) {
  const { t } = useTranslation('auth');

  return (
    <View style={styles.form}>
      <View style={styles.titleZone}>
        <Title variant="display" lead={t('register.headline')} accent={t('register.brand')} colorScheme={colorScheme} />
      </View>

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

      <Button label={t('register.submit')} onPress={onSubmit} loading={loading} disabled={!canSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 6 },
  // Il titolo display è grande: senza respiro sotto si incolla al primo input
  titleZone: { paddingBottom: 20 },
});
