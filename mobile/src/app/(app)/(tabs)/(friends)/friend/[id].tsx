import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { List, UserMinus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { resolveListIcon } from '@/constants/list-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useNavbarClearance } from '@/utils/useNavbarClearance';
import { RadialBackground } from '@/components/molecules/radial-background';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { Avatar } from '@/components/atoms/Avatar';
import { Button } from '@/components/atoms/Button';
import { PageHeader } from '@/components/molecules/PageHeader';
import { Tabs } from '@/components/molecules/Tabs';
import { ConfirmSheet } from '@/components/molecules/confirm-sheet';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { ProfileStatsGroup } from '@/components/molecules/profile-stats-group';
import { ListCard } from '@/components/cards/ListCard';
import { ItemCard } from '@/components/cards/ItemCard';
import { useFriendProfile, type FriendList } from '@/utils/useFriendProfile';
import { useRemoveFriend } from '@/utils/useFriends';
import { useProfileStats } from '@/utils/useProfileStats';

const SKELETON_COUNT = 3;

type ThemeColors = (typeof Colors)[keyof typeof Colors];

// Stessa mappa stato -> colore usata in list/[id].tsx per gli item della propria lista
function resolveItemStatusColor(status: string, colors: ThemeColors): string {
  if (status === 'IN_PROGRESS') return colors.warning;
  if (status === 'COMPLETED') return colors.success;
  return colors.border;
}

export default function FriendProfileScreen() {
  const { t } = useTranslation('friends');
  // Namespace 'lists': riuso le etichette di stato e lo stato vuoto già tradotti per le liste proprie
  const { t: tLists } = useTranslation('lists');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const listBottomPadding = useNavbarClearance();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile, loading, error } = useFriendProfile(id);
  const { categoryStats: myCategoryStats, completionBreakdown: myCompletionBreakdown } = useProfileStats();
  const { removeFriend } = useRemoveFriend();

  const [statsTab, setStatsTab] = useState(0);
  const [showLists, setShowLists] = useState(false);
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const [selectedList, setSelectedList] = useState<FriendList | null>(null);

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
              onPress={() => setSelectedList(list)}
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
                />
              ) : (
                <View style={styles.compareGroup}>
                  <ProfileStatsGroup
                    label={t('friend.stats.you')}
                    categoryStats={myCategoryStats}
                    completionBreakdown={myCompletionBreakdown}
                  />
                  <ProfileStatsGroup
                    label={profile.user.username}
                    categoryStats={profile.stats.categoryStats}
                    completionBreakdown={profile.stats.completionBreakdown}
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

      <BottomSheet visible={selectedList != null} onClose={() => setSelectedList(null)}>
        {selectedList && (
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              {(() => {
                const ListIcon = resolveListIcon(selectedList.icon);
                return <ListIcon size={20} color={selectedList.color} />;
              })()}
              <Text style={[styles.sheetTitle, { color: colors.textColor }]} numberOfLines={1}>
                {selectedList.name}
              </Text>
            </View>
            <FlatList
              style={styles.sheetList}
              data={selectedList.items}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sheetListContent}
              renderItem={({ item }) => (
                <View style={styles.sheetItemRow}>
                  <ItemCard
                    title={item.name}
                    category={item.category.name}
                    categoryIcon={item.category.icon}
                    status={tLists(`status.${item.status}`)}
                    statusColor={resolveItemStatusColor(item.status, colors)}
                  />
                  {item.note ? (
                    <Text style={[styles.sheetItemNote, { color: colors.textColor }]}>{item.note}</Text>
                  ) : null}
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={[styles.emptyTitle, { color: colors.textColor }]}>
                    {tLists('detail.emptyTitle')}
                  </Text>
                </View>
              }
            />
          </View>
        )}
      </BottomSheet>
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
  sheetContent: {
    flex: 1,
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  sheetTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
  },
  sheetList: {
    flex: 1,
  },
  sheetListContent: {
    gap: Spacing.two + Spacing.one,
    paddingBottom: Spacing.four,
  },
  sheetItemRow: {
    gap: Spacing.one,
  },
  sheetItemNote: {
    fontSize: 14,
    opacity: 0.7,
    paddingHorizontal: Spacing.one,
  },
});
