import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { List, UserMinus, Users } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useNavbarClearance } from '@/utils/useNavbarClearance';
import { RadialBackground } from '@/components/molecules/radial-background';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { Avatar } from '@/components/atoms/Avatar';
import { Button } from '@/components/atoms/Button';
import { PageHeader } from '@/components/molecules/PageHeader';
import { Tabs } from '@/components/molecules/Tabs';
import { ConfirmSheet } from '@/components/molecules/confirm-sheet';
import { ProfileStatsGroup } from '@/components/molecules/profile-stats-group';
import { ListCard } from '@/components/cards/ListCard';
import { useFriendProfile } from '@/utils/useFriendProfile';
import { useRemoveFriend } from '@/utils/useFriends';
import { useProfileStats } from '@/utils/useProfileStats';

const SKELETON_COUNT = 3;

export default function FriendProfileScreen() {
  const { t } = useTranslation('friends');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const listBottomPadding = useNavbarClearance();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile, loading, error } = useFriendProfile(id);
  const {
    categoryStats: myCategoryStats,
    completionBreakdown: myCompletionBreakdown,
    drawAcceptance: myDrawAcceptance,
  } = useProfileStats();
  const { removeFriend } = useRemoveFriend();

  const [statsTab, setStatsTab] = useState(0);
  const [showLists, setShowLists] = useState(false);
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  const showSkeleton = loading && !profile;

  const handleRemoveConfirmed = async () => {
    if (!id) return;
    await removeFriend(id);
    setConfirmingRemove(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader
        icon={Users}
        title={profile?.user.username ?? ''}
        onBack={() => router.back()}
        action={{ icon: UserMinus, onPress: () => setConfirmingRemove(true) }}
      />

      {showSkeleton ? (
        <View style={styles.content}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <ListCardSkeleton key={i} colorScheme={colorScheme} />
          ))}
        </View>
      ) : !profile ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { color: colors.textColor }]}>
            {error ? t('friend.error') : t('friend.notFound')}
          </Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={showLists ? profile.lists : []}
          keyExtractor={(list) => list.id}
          contentContainerStyle={[styles.content, { paddingBottom: listBottomPadding }]}
          renderItem={({ item: list }) => (
            <ListCard
              title={list.name}
              category={t('friend.itemCount', { count: list.itemCount })}
              icon={List}
              color={list.color}
              itemsCount={list.itemCount}
              onPress={() => {}}
            />
          )}
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={styles.userRow}>
                <Avatar uri={profile.user.avatarUrl ?? undefined} fallbackColor={colors.primary} />
                <Text style={[styles.username, { color: colors.textColor }]} numberOfLines={1}>
                  {profile.user.username}
                </Text>
              </View>

              <Tabs
                items={[t('friend.stats.onlyTheirs'), t('friend.stats.compare')]}
                activeIndex={statsTab}
                onChange={setStatsTab}
              />

              {statsTab === 0 ? (
                <ProfileStatsGroup
                  label={profile.user.username}
                  categoryStats={profile.stats.categoryStats}
                  completionBreakdown={profile.stats.completionBreakdown}
                  drawAcceptance={profile.stats.drawAcceptance}
                />
              ) : (
                <View style={styles.compareGroup}>
                  <ProfileStatsGroup
                    label={t('friend.stats.you')}
                    categoryStats={myCategoryStats}
                    completionBreakdown={myCompletionBreakdown}
                    drawAcceptance={myDrawAcceptance}
                  />
                  <ProfileStatsGroup
                    label={profile.user.username}
                    categoryStats={profile.stats.categoryStats}
                    completionBreakdown={profile.stats.completionBreakdown}
                    drawAcceptance={profile.stats.drawAcceptance}
                  />
                </View>
              )}

              <Button
                variant="secondary"
                icon={List}
                label={showLists ? t('friend.hideLists') : t('friend.viewLists')}
                onPress={() => setShowLists((v) => !v)}
              />

              {showLists && (
                <Text style={[styles.sectionTitle, { color: colors.textColor }]}>
                  {t('friend.listsTitle')}
                </Text>
              )}
            </View>
          }
          ListEmptyComponent={
            showLists ? (
              <View style={styles.empty}>
                <Text style={[styles.emptyTitle, { color: colors.textColor }]}>
                  {t('friend.listsEmpty')}
                </Text>
              </View>
            ) : null
          }
        />
      )}

      <ConfirmSheet
        visible={confirmingRemove}
        title={t('friends.removeConfirmTitle')}
        message={t('friends.removeConfirmMessage')}
        confirmLabel={t('friends.remove')}
        cancelLabel={t('cancel', { defaultValue: 'Cancel' })}
        colorScheme={colorScheme}
        onConfirm={handleRemoveConfirmed}
        onCancel={() => setConfirmingRemove(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.two + Spacing.one,
  },
  header: {
    gap: Spacing.three,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  username: {
    flex: 1,
    fontSize: 26,
  },
  compareGroup: {
    gap: Spacing.four,
  },
  sectionTitle: {
    fontSize: 20,
    paddingTop: Spacing.three,
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing.five,
    paddingHorizontal: Spacing.five,
    gap: Spacing.two,
  },
  emptyTitle: {
    fontSize: 18,
    textAlign: 'center',
  },
});
