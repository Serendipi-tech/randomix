import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/molecules/Input';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { ProfileHeader } from '@/components/molecules/profile-header';
import { useAuth } from '@/utils/useAuth';
import { useProfile } from '@/utils/useProfile';

const USERNAME_MIN_LENGTH = 3;

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation('profile');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const { logout } = useAuth();

  const { profile, loading: loadingProfile, updateProfile, saving, saveError } = useProfile();

  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const startEditing = () => {
    setUsername(profile?.username ?? '');
    setLocalError(null);
    setEditing(true);
  };

  const saveProfile = async () => {
    setLocalError(null);
    if (username.trim().length < USERNAME_MIN_LENGTH) {
      setLocalError(t('usernameTooShort'));
      return;
    }
    try {
      await updateProfile({ username: username.trim() });
      setEditing(false);
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  const editError = localError ?? saveError?.message ?? null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RadialBackground colorScheme={colorScheme} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textColor }]}>{t('title')}</Text>

        {loadingProfile && !profile ? (
          <ListCardSkeleton colorScheme={colorScheme} />
        ) : profile && !editing ? (
          <ProfileHeader
            username={profile.username}
            email={profile.email}
            avatarUrl={profile.avatarUrl}
            colorScheme={colorScheme}
            editLabel={t('edit')}
            onEditPress={startEditing}
          />
        ) : profile ? (
          <View style={[styles.editCard, { backgroundColor: colors.foreground }]}>
            <Input
              placeholder={t('usernamePlaceholder')}
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
            {editError && <Text style={styles.error}>{editError}</Text>}
            <Button label={t('save')} onPress={saveProfile} loading={saving} />
            <Button
              variant="secondary"
              label={t('cancel')}
              onPress={() => setEditing(false)}
              disabled={saving}
            />
          </View>
        ) : null}

        <View style={styles.logoutWrap}>
          <Button variant="secondary" label="Colors" onPress={() => router.push('/colors-showcase')} />
          <Button variant="secondary" label={t('logout')} onPress={logout} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two + Spacing.one,
  },
  title: {
    fontSize: 28,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.one,
  },
  editCard: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  error: {
    fontSize: 14,
    color: Colors.light.error,
    textAlign: 'center',
  },
  logoutWrap: {
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
});
