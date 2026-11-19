import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react-native';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useNavbarClearance } from '@/utils/useNavbarClearance';
import { RadialBackground } from '@/components/molecules/radial-background';
import { PageHeader } from '@/components/molecules/PageHeader';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { FriendRequestRow } from '@/components/molecules/friend-request-row';
import { NotificationCard } from '@/components/cards/NotificationCard';
import { useNotifications } from '@/utils/useNotifications';
import { useFriendRequests } from '@/utils/useFriendRequests';

const SKELETON_COUNT = 4;

export default function NotificationsScreen() {
  const { t } = useTranslation('notifications');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const listBottomPadding = useNavbarClearance();

  const { notifications, loading, error, markAsRead } = useNotifications();
  const { requests, acceptRequest, rejectRequest, answering } = useFriendRequests();

  const showSkeleton = loading && notifications.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader icon={Bell} title={t('title')} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={showSkeleton ? [] : notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { paddingBottom: listBottomPadding }]}
        renderItem={({ item }) => (
          <Pressable onPress={() => markAsRead(item.id)} disabled={item.markedAsRead}>
            <NotificationCard
              title={item.title}
              body={item.body ?? undefined}
              time={item.timeLabel}
              unread={!item.markedAsRead}
            />
          </Pressable>
        )}
        ListHeaderComponent={
          requests.length > 0 ? (
            <View style={styles.header}>
              <Text style={[styles.sectionTitle, { color: colors.textColor }]}>{t('requests.title')}</Text>
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
            </View>
          ) : null
        }
        ListEmptyComponent={
          showSkeleton ? (
            <View style={styles.header}>
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <ListCardSkeleton key={i} colorScheme={colorScheme} />
              ))}
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: colors.textColor }]}>
                {error ? t('error') : t('empty.title')}
              </Text>
              {!error && (
                <Text style={[styles.emptySubtitle, { color: colors.disabled }]}>{t('empty.subtitle')}</Text>
              )}
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two + Spacing.one,
  },
  header: {
    gap: Spacing.two + Spacing.one,
  },
  sectionTitle: {
    fontSize: 20,
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
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});
