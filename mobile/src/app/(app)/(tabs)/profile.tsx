import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LogOut, MessageSquare, Settings } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing } from '@/constants/theme';
import { AVATAR_PRESETS, resolveAvatarUri } from '@/constants/avatar-presets';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { ConfirmSheet } from '@/components/molecules/confirm-sheet';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/molecules/Input';
import { FormError } from '@/components/molecules/form-error';
import { CardShell } from '@/components/cards/CardShell';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { ProfileHeader } from '@/components/molecules/profile-header';
import { ProfileStatsPanel } from '@/components/molecules/profile-stats-panel';
import { useAuth } from '@/utils/useAuth';
import { useProfile } from '@/utils/useProfile';
import { useMyFriends } from '@/utils/useFriends';

const USERNAME_MIN_LENGTH = 3;
// Deve combaciare con AVATAR_SIZE/2 di ProfileHeader: spazio per l'avatar che sfonda la card.
const HERO_TOP_SPACE = 48;

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation('profile');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const { logout } = useAuth();

  const { profile, loading: loadingProfile, updateProfile, saving, saveError } = useProfile();
  const { friends } = useMyFriends();

  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [confirmingLogout, setConfirmingLogout] = useState(false);

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
      {/* Barra azioni senza titolo: la pagina si identifica già dalla tab attiva */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.push('/feedback')} hitSlop={10}>
          <MessageSquare size={24} color={colors.textColor} />
        </Pressable>
        <Pressable onPress={() => router.push('/settings')} hitSlop={10}>
          <Settings size={24} color={colors.textColor} />
        </Pressable>
        <Pressable onPress={() => setConfirmingLogout(true)} hitSlop={10}>
          <LogOut size={24} color={colors.textColor} />
        </Pressable>
      </View>
      <View style={styles.content}>
        {loadingProfile && !profile ? (
          <ListCardSkeleton colorScheme={colorScheme} />
        ) : profile && !editing ? (
          <>
            <Animated.View entering={FadeInDown.duration(500)} style={styles.heroSpace}>
              <ProfileHeader
                username={profile.username}
                email={profile.email}
                avatarUrl={profile.avatarUrl}
                colorScheme={colorScheme}
                editLabel={t('edit')}
                onEditPress={startEditing}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(120).duration(400)}>
              <ProfileStatsPanel
                listsCount={profile.listsCount}
                totalItemsCount={profile.totalItemsCount}
                completedItemsCount={profile.completedItemsCount}
                friendsCount={friends.length}
              />
            </Animated.View>
          </>
        ) : profile ? (
          <Animated.View entering={FadeIn.duration(300)}>
            <CardShell backgroundColor={colors.foreground} borderColor={colors.border}>
              <View style={styles.editSection}>
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
                {editError && <FormError message={editError} />}
                <Button label={t('save')} onPress={saveProfile} loading={saving} />
                <Button
                  variant="secondary"
                  label={t('cancel')}
                  onPress={() => setEditing(false)}
                  disabled={saving}
                />
              </View>
            </CardShell>
          </Animated.View>
        ) : null}
      </View>

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
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
  },
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two + Spacing.one,
  },
  heroSpace: {
    marginTop: HERO_TOP_SPACE,
  },
  editSection: {
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
});
