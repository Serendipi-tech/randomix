import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthBackgroundView } from '@/components/molecules/auth-background';
import { AuthButton } from '@/components/atoms/auth-button';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/utils/useAuth';

export default function SettingsScreen() {
  const { t } = useTranslation('settings');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const { logout } = useAuth();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AuthBackgroundView colorScheme={colorScheme} />
      <Text style={[styles.title, { color: colors.text }]}>{t('title')}</Text>
      <View style={styles.logoutWrap}>
        <AuthButton colorScheme={colorScheme} variant="secondary" label={t('logout')} onPress={logout} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Fredoka_700Bold',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  logoutWrap: {
    marginHorizontal: Spacing.four,
  },
});
