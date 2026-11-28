import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { useProfile } from '@/utils/useProfile';
import { useEmailChange } from '@/utils/useEmailChange';

export default function EmailSettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation('profile');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const { profile } = useProfile();
  const { requestChange, confirmChange, loading, error } = useEmailChange();

  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const sendCode = async () => {
    setLocalError(null);
    try {
      await requestChange(newEmail.trim());
      setOtpSent(true);
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  const confirmEmail = async () => {
    setLocalError(null);
    try {
      await confirmChange(otp.trim());
      router.back();
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  // Torna allo step email mantenendo il valore digitato, per correggere un refuso senza riscrivere tutto.
  const editEmail = () => {
    setLocalError(null);
    setOtp('');
    setOtpSent(false);
  };

  const errorMessage = localError ?? error ?? null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader onBack={() => router.back()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title={t('settings.email.heading')} />
        <Text style={[styles.explanation, { color: colors.disabled }]}>
          {t('settings.email.flowExplanation')}
        </Text>

        <CardShell backgroundColor={colors.foreground} borderColor={colors.border}>
          <View style={styles.section}>
            <View style={styles.currentRow}>
              <Text style={[styles.currentLabel, { color: colors.disabled }]}>
                {t('settings.email.current')}
              </Text>
              <Text style={[styles.currentValue, { color: colors.textColor }]} numberOfLines={1}>
                {profile?.email}
              </Text>
            </View>

            {otpSent ? (
              <Input
                placeholder={t('settings.email.otpPlaceholder')}
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
              />
            ) : (
              <Input
                placeholder={t('settings.email.newPlaceholder')}
                autoCapitalize="none"
                keyboardType="email-address"
                value={newEmail}
                onChangeText={setNewEmail}
              />
            )}

            {errorMessage && <FormError message={errorMessage} />}

            {otpSent ? (
              <>
                <Button
                  label={t('settings.email.confirm')}
                  onPress={confirmEmail}
                  loading={loading}
                  disabled={otp.trim().length === 0}
                />
                <Button
                  variant="secondary"
                  label={t('settings.email.editAddress')}
                  onPress={editEmail}
                  disabled={loading}
                />
              </>
            ) : (
              <Button
                label={t('settings.email.sendCode')}
                onPress={sendCode}
                loading={loading}
                disabled={newEmail.trim().length === 0}
              />
            )}
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
  explanation: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.two,
  },
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  currentLabel: {
    fontSize: 14,
  },
  currentValue: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '600',
  },
});
