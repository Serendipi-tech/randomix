import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CreditCard, KeyRound, LogOut, Mail } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { PageHeader } from '@/components/molecules/PageHeader';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { SettingsRow } from '@/components/molecules/SettingsRow';
import { Divider } from '@/components/atoms/Divider';
import { CardShell } from '@/components/cards/CardShell';
import { ConfirmSheet } from '@/components/molecules/confirm-sheet';
import { useAuth } from '@/utils/useAuth';
import { useProfile } from '@/utils/useProfile';

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation('profile');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const { logout } = useAuth();
  const { profile } = useProfile();
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader onBack={() => router.back()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.group}>
          <SectionHeader title={t('settings.sections.account')} />
          <CardShell backgroundColor={colors.foreground} borderColor={colors.border} padding={0}>
            <SettingsRow
              icon={Mail}
              label={t('settings.email.row')}
              value={profile?.email}
              onPress={() => router.push('/settings/email')}
            />
            <Divider />
            <SettingsRow
              icon={KeyRound}
              label={t('settings.password.row')}
              onPress={() => router.push('/settings/password')}
            />
          </CardShell>
        </View>

        <View style={styles.group}>
          <SectionHeader title={t('settings.sections.subscription')} />
          <CardShell backgroundColor={colors.foreground} borderColor={colors.border} padding={0}>
            <SettingsRow
              icon={CreditCard}
              label={t('settings.payments.row')}
              onPress={() => router.push('/my-plan')}
            />
          </CardShell>
        </View>

        {/* Azione distruttiva in fondo, dopo tutte le impostazioni: standard iOS/Android */}
        <View style={styles.group}>
          <SectionHeader title={t('settings.sections.session')} />
          <CardShell backgroundColor={colors.foreground} borderColor={colors.border} padding={0}>
            <SettingsRow
              icon={LogOut}
              label={t('logout')}
              destructive
              onPress={() => setConfirmingLogout(true)}
            />
          </CardShell>
        </View>
      </ScrollView>

      <ConfirmSheet
        visible={confirmingLogout}
        title={t('logoutConfirm.title')}
        message={t('logoutConfirm.message')}
        confirmLabel={t('logoutConfirm.confirm')}
        cancelLabel={t('cancel')}
        colorScheme={colorScheme}
        onConfirm={logout}
        onCancel={() => setConfirmingLogout(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Come nel profilo: assoluto e non flex:1, altrimenti su web il contenitore a monte non lascia scorrere
  safe: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  group: {
    gap: Spacing.two,
  },
});
