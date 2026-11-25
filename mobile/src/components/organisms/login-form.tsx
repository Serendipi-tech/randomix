import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/molecules/Input';
import { Title } from '@/components/molecules/title';
import { FormError } from '@/components/molecules/form-error';

type LoginFormProps = {
  colorScheme: 'light' | 'dark';
  identifier: string;
  onIdentifierChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  error: string | null;
  loading: boolean;
  onSubmit: () => void;
};

/** Contenuto della bottomsheet di login: credenziali + submit. */
export function LoginForm({
  colorScheme,
  identifier,
  onIdentifierChange,
  password,
  onPasswordChange,
  error,
  loading,
  onSubmit,
}: LoginFormProps) {
  const { t } = useTranslation('auth');

  return (
    <View style={styles.form}>
      <View style={styles.titleZone}>
        <Title variant="display" lead={t('login.headline')} accent={t('login.brand')} colorScheme={colorScheme} />
      </View>

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

      {error && <FormError message={error} />}

      <Button label={t('login.submit')} onPress={onSubmit} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 6 },
  // Il titolo display è grande: senza respiro sotto si incolla al primo input
  titleZone: { paddingBottom: 20 },
});
