import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabInset, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthButton } from '@/components/atoms/auth-button';
import { AuthInput } from '@/components/atoms/auth-input';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { FriendRow } from '@/components/molecules/friend-row';
import { ProfileHeader } from '@/components/molecules/profile-header';
import { useMyFriends } from '@/utils/useFriends';
import { useProfile } from '@/utils/useProfile';

const SKELETON_COUNT = 4;
const USERNAME_MIN_LENGTH = 3;

export default function SocialScreen() {
  const { t } = useTranslation('social');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];

  const { profile, loading: loadingProfile, updateProfile, saving, saveError } = useProfile();
  const { friends, loading: loadingFriends, error: friendsError } = useMyFriends();

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
      setLocalError(t('profile.usernameTooShort'));
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
  const showFriendsSkeleton = loadingFriends && friends.length === 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <FlatList
        data={showFriendsSkeleton ? [] : friends}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}
        renderItem={({ item }) => (
          <FriendRow username={item.username} avatarUrl={item.avatarUrl} colorScheme={colorScheme} />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{t('title')}</Text>

            {loadingProfile && !profile ? (
              <ListCardSkeleton colorScheme={colorScheme} />
            ) : profile && !editing ? (
              <ProfileHeader
                username={profile.username}
                email={profile.email}
                avatarUrl={profile.avatarUrl}
                colorScheme={colorScheme}
                editLabel={t('profile.edit')}
                onEditPress={startEditing}
              />
            ) : profile ? (
              <View style={[styles.editCard, { backgroundColor: colors.backgroundElement }]}>
                <AuthInput
                  colorScheme={colorScheme}
                  placeholder={t('profile.usernamePlaceholder')}
                  autoCapitalize="none"
                  value={username}
                  onChangeText={setUsername}
                />
                {editError && <Text style={styles.error}>{editError}</Text>}
                <AuthButton
                  colorScheme={colorScheme}
                  label={t('profile.save')}
                  onPress={saveProfile}
                  loading={saving}
                />
                <AuthButton
                  colorScheme={colorScheme}
                  variant="secondary"
                  label={t('profile.cancel')}
                  onPress={() => setEditing(false)}
                  disabled={saving}
                />
              </View>
            ) : null}

            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('friends.title')}</Text>
            {showFriendsSkeleton &&
              Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <ListCardSkeleton key={i} colorScheme={colorScheme} />
              ))}
          </View>
        }
        ListEmptyComponent={
          showFriendsSkeleton ? null : (
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {friendsError ? t('friends.error') : t('friends.empty.title')}
              </Text>
              {!friendsError && (
                <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                  {t('friends.empty.subtitle')}
                </Text>
              )}
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two + Spacing.one,
  },
  header: {
    gap: Spacing.two + Spacing.one,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Fredoka_700Bold',
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
    color: '#E53E3E',
    textAlign: 'center',
    fontFamily: 'Nunito_500Medium',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Fredoka_700Bold',
    paddingTop: Spacing.three,
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing.four,
    paddingHorizontal: Spacing.five,
    gap: Spacing.two,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Fredoka_700Bold',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
    textAlign: 'center',
  },
});
