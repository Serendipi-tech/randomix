import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { PageHeader } from '@/components/molecules/PageHeader';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { Input } from '@/components/molecules/Input';
import { Button } from '@/components/atoms/Button';
import { FormError } from '@/components/molecules/form-error';
import { CardShell } from '@/components/cards/CardShell';
import { useChangePassword } from '@/utils/useChangePassword';
import { isPasswordValid } from '@/utils/passwordStrength';

export default function PasswordSettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation('profile');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const { changePassword, loading, error } = useChangePassword();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  // Submit disabilitato finche' i vincoli non sono soddisfatti: niente errore da mostrare dopo il tap
  const canSubmitPassword =
    oldPassword.length > 0 && isPasswordValid(newPassword) && newPassword === confirmPassword;

  const submitPassword = async () => {
    setLocalError(null);
    try {
      await changePassword({ oldPassword, newPassword });
      router.back();
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  const errorMessage = localError ?? error?.message ?? null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader onBack={() => router.back()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title={t('settings.password.heading')} />

        <CardShell backgroundColor={colors.foreground} borderColor={colors.border}>
          <View style={styles.section}>
            <Input
              variant="password"
              placeholder={t('settings.password.oldPlaceholder')}
              value={oldPassword}
              onChangeText={setOldPassword}
              showStrength={false}
            />
            <Input
              variant="password"
              placeholder={t('settings.password.newPlaceholder')}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <Input
              variant="password"
              placeholder={t('settings.password.confirmPlaceholder')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              showStrength={false}
            />
            {errorMessage && <FormError message={errorMessage} />}
            <Button
              label={t('settings.password.submit')}
              onPress={submitPassword}
              loading={loading}
              disabled={!canSubmitPassword}
            />
          </View>
        </CardShell>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  section: {
    gap: 12,
  },
});
