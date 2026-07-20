import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackgroundView } from '@/components/molecules/gradient-background';
import { Button } from '@/components/atoms/button';
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
      <GradientBackgroundView colorScheme={colorScheme} />
      <Text style={[styles.title, { color: colors.text }]}>{t('title')}</Text>
      <View style={styles.logoutWrap}>
        <Button colorScheme={colorScheme} variant="secondary" label={t('logout')} onPress={logout} />
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
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  logoutWrap: {
    marginHorizontal: Spacing.four,
  },
});
