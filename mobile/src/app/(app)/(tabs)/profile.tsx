import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { AVATAR_PRESETS, resolveAvatarUri } from '@/constants/avatar-presets';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { PageHeader } from '@/components/molecules/PageHeader';
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
  const [avatarUrl, setAvatarUrl] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const startEditing = () => {
    setUsername(profile?.username ?? '');
    setAvatarUrl(profile?.avatarUrl ?? '');
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
      await updateProfile({ username: username.trim(), avatarUrl });
      setEditing(false);
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  const editError = localError ?? saveError?.message ?? null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader icon={User} title={t('title')} />
      <View style={styles.content}>
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
            <Text style={[styles.avatarLabel, { color: colors.textColor }]}>{t('avatarLabel')}</Text>
            <View style={styles.avatarRow}>
              {AVATAR_PRESETS.map((preset) => {
                const selected = avatarUrl === preset.path;
                return (
                  <Pressable
                    key={preset.key}
                    onPress={() => setAvatarUrl(preset.path)}
                    style={[styles.avatarOption, { borderColor: selected ? colors.primary : 'transparent' }]}
                  >
                    <Image source={{ uri: resolveAvatarUri(preset.path) }} style={styles.avatarImg} />
                  </Pressable>
                );
              })}
            </View>
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
  editCard: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  avatarLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: 12,
  },
  avatarOption: {
    borderWidth: 2,
    borderRadius: 34,
    padding: 3,
  },
  avatarImg: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
