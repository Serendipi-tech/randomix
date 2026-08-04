import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react-native';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { PageHeader } from '@/components/molecules/PageHeader';

export default function NotificationsScreen() {
  const { t } = useTranslation('notifications');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader icon={Bell} title={t('title')} />
      <Text style={[styles.comingSoon, { color: colors.disabled }]}>{t('comingSoon')}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  comingSoon: {
    fontSize: 16,
    paddingHorizontal: Spacing.four,
  },
});
