import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CreditCard, Settings as SettingsIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { PageHeader } from '@/components/molecules/PageHeader';
import { Input } from '@/components/molecules/Input';
import { Button } from '@/components/atoms/Button';
import { FormError } from '@/components/molecules/form-error';
import { CardShell } from '@/components/cards/CardShell';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { EmptyState } from '@/components/molecules/EmptyState';
import { useProfile } from '@/utils/useProfile';
import { useEmailChange } from '@/utils/useEmailChange';
import { useChangePassword } from '@/utils/useChangePassword';

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation('profile');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];

  const { profile } = useProfile();
  const [paymentsSheetOpen, setPaymentsSheetOpen] = useState(false);

  const {
    requestChange,
    confirmChange,
    loading: emailLoading,
    error: emailError,
  } = useEmailChange();
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [emailLocalError, setEmailLocalError] = useState<string | null>(null);

  const sendCode = async () => {
    setEmailLocalError(null);
    try {
      await requestChange(newEmail.trim());
      setOtpSent(true);
    } catch (e) {
      setEmailLocalError((e as Error).message);
    }
  };

  const confirmEmail = async () => {
    setEmailLocalError(null);
    try {
      await confirmChange(otp.trim());
      setOtpSent(false);
      setNewEmail('');
      setOtp('');
    } catch (e) {
      setEmailLocalError((e as Error).message);
    }
  };

  // Torna allo step email mantenendo il valore digitato, per correggere un refuso senza riscrivere tutto.
  const editEmail = () => {
    setEmailLocalError(null);
    setOtp('');
    setOtpSent(false);
  };

  const emailErrorMessage = emailLocalError ?? emailError ?? null;

  const {
    changePassword,
    loading: passwordLoading,
    error: passwordError,
  } = useChangePassword();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLocalError, setPasswordLocalError] = useState<string | null>(null);

  const submitPassword = async () => {
    setPasswordLocalError(null);
    if (newPassword !== confirmPassword) {
      setPasswordLocalError(t('settings.password.mismatch'));
      return;
    }
    try {
      await changePassword({ oldPassword, newPassword });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      setPasswordLocalError((e as Error).message);
    }
  };

  const passwordErrorMessage = passwordLocalError ?? passwordError?.message ?? null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader icon={SettingsIcon} title={t('settings.title')} onBack={() => router.back()} />
      <View style={styles.content}>
        <CardShell backgroundColor={colors.foreground} borderColor={colors.border}>
          <View style={styles.section}>
            <Text style={[styles.heading, { color: colors.textColor }]}>{t('settings.email.heading')}</Text>
            <View style={styles.currentRow}>
              <Text style={[styles.currentLabel, { color: colors.textColor }]}>{t('settings.email.current')}</Text>
              <Text style={[styles.currentValue, { color: colors.textColor }]}>{profile?.email}</Text>
            </View>
            {!otpSent ? (
              <Input
                placeholder={t('settings.email.newPlaceholder')}
                autoCapitalize="none"
                keyboardType="email-address"
                value={newEmail}
                onChangeText={setNewEmail}
              />
            ) : (
              <Input
                placeholder={t('settings.email.otpPlaceholder')}
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
              />
            )}
            {emailErrorMessage && <FormError message={emailErrorMessage} />}
            {!otpSent ? (
              <Button
                label={t('settings.email.sendCode')}
                onPress={sendCode}
                loading={emailLoading}
                disabled={newEmail.trim().length === 0}
              />
            ) : (
              <>
                <Button
                  label={t('settings.email.confirm')}
                  onPress={confirmEmail}
                  loading={emailLoading}
                  disabled={otp.trim().length === 0}
                />
                <Button variant="secondary" label={t('cancel')} onPress={editEmail} disabled={emailLoading} />
              </>
            )}
          </View>
        </CardShell>

        <CardShell backgroundColor={colors.foreground} borderColor={colors.border}>
          <View style={styles.section}>
            <Text style={[styles.heading, { color: colors.textColor }]}>{t('settings.password.heading')}</Text>
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
            {passwordErrorMessage && <FormError message={passwordErrorMessage} />}
            <Button
              label={t('settings.password.submit')}
              onPress={submitPassword}
              loading={passwordLoading}
              disabled={!oldPassword || !newPassword || !confirmPassword}
            />
          </View>
        </CardShell>

        <CardShell backgroundColor={colors.foreground} borderColor={colors.border}>
          <View style={styles.section}>
            <Text style={[styles.heading, { color: colors.textColor }]}>{t('settings.payments.heading')}</Text>
            <Text style={[styles.currentLabel, { color: colors.textColor }]}>{t('settings.payments.description')}</Text>
            <Button
              variant="secondary"
              icon={CreditCard}
              label={t('settings.payments.cta')}
              onPress={() => setPaymentsSheetOpen(true)}
            />
          </View>
        </CardShell>
      </View>

      <BottomSheet visible={paymentsSheetOpen} onClose={() => setPaymentsSheetOpen(false)}>
        <View style={styles.paymentsSheet}>
          <EmptyState
            icon={CreditCard}
            title={t('settings.payments.comingSoon.title')}
            subtitle={t('settings.payments.comingSoon.subtitle')}
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  section: {
    gap: 12,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
  },
  currentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  currentValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  paymentsSheet: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },
});
