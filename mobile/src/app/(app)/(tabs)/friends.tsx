import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabInset, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { GradientBackgroundView } from '@/components/molecules/gradient-background';
import { Input } from '@/components/atoms/input';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { ConfirmSheet } from '@/components/molecules/confirm-sheet';
import { FriendRequestRow } from '@/components/molecules/friend-request-row';
import { FriendRow } from '@/components/molecules/friend-row';
import { UserSearchRow } from '@/components/molecules/user-search-row';
import { useMyFriends, useRemoveFriend, type Friend } from '@/utils/useFriends';
import { useFriendRequests } from '@/utils/useFriendRequests';
import { useUserSearch, type FriendRelation } from '@/utils/useUserSearch';

const SKELETON_COUNT = 4;

export default function FriendsScreen() {
  const { t } = useTranslation('friends');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const { friends, loading: loadingFriends, error: friendsError } = useMyFriends();
  const { requests, acceptRequest, rejectRequest, answering } = useFriendRequests();
  const search = useUserSearch();
  const { removeFriend } = useRemoveFriend();

  const [friendToRemove, setFriendToRemove] = useState<Friend | null>(null);

  const handleRemoveConfirmed = () => {
    if (friendToRemove) removeFriend(friendToRemove.id);
    setFriendToRemove(null);
  };

  // etichetta di stato per i risultati di ricerca già in relazione con me
  const relationLabel = (relation: FriendRelation): string | null =>
    relation === 'NONE' ? null : t(`search.relation.${relation}`);

  const showFriendsSkeleton = loadingFriends && friends.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <GradientBackgroundView colorScheme={colorScheme} />
      <FlatList
        data={showFriendsSkeleton ? [] : friends}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}
        renderItem={({ item }) => (
          <FriendRow
            username={item.username}
            avatarUrl={item.avatarUrl}
            colorScheme={colorScheme}
            onPress={() => router.push({ pathname: '/friend/[id]', params: { id: item.id } })}
            onRemove={() => setFriendToRemove(item)}
            removeLabel={t('friends.remove')}
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{t('title')}</Text>

            {requests.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('requests.title')}</Text>
                {requests.map((request) => (
                  <FriendRequestRow
                    key={request.id}
                    username={request.sender.username}
                    avatarUrl={request.sender.avatarUrl}
                    colorScheme={colorScheme}
                    acceptLabel={t('requests.accept')}
                    rejectLabel={t('requests.reject')}
                    onAccept={() => acceptRequest(request.id)}
                    onReject={() => rejectRequest(request.id)}
                    disabled={answering}
                  />
                ))}
              </>
            )}

            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('search.title')}</Text>
            <Input
              colorScheme={colorScheme}
              placeholder={t('search.placeholder')}
              autoCapitalize="none"
              value={search.query}
              onChangeText={search.setQuery}
            />
            {search.error && <Text style={styles.error}>{t('search.error')}</Text>}
            {search.results.map((result) => (
              <UserSearchRow
                key={result.user.id}
                username={result.user.username}
                avatarUrl={result.user.avatarUrl}
                colorScheme={colorScheme}
                statusLabel={relationLabel(result.relation)}
                addLabel={t('search.add')}
                onAdd={() => search.sendRequest(result.user.id)}
                disabled={search.sending}
              />
            ))}
            {search.active && !search.searching && !search.error && search.results.length === 0 && (
              <Text style={[styles.searchEmpty, { color: colors.textSecondary }]}>{t('search.empty')}</Text>
            )}

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

      <ConfirmSheet
        visible={friendToRemove != null}
        title={t('friends.removeConfirmTitle')}
        message={t('friends.removeConfirmMessage')}
        confirmLabel={t('friends.remove')}
        cancelLabel={t('cancel', { defaultValue: 'Cancel' })}
        colorScheme={colorScheme}
        onConfirm={handleRemoveConfirmed}
        onCancel={() => setFriendToRemove(null)}
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
    paddingTop: Spacing.three,
    paddingBottom: Spacing.one,
  },
  error: {
    fontSize: 14,
    color: Colors.light.error,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    paddingTop: Spacing.three,
  },
  searchEmpty: {
    fontSize: 14,
    textAlign: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing.four,
    paddingHorizontal: Spacing.five,
    gap: Spacing.two,
  },
  emptyTitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});
