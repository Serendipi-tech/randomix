import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { UserAvatar } from '@/components/atoms/user-avatar';
import { ListCard } from '@/components/molecules/list-card';
import { useFriendProfile } from '@/utils/useFriendProfile';

const SKELETON_COUNT = 3;

export default function FriendProfileScreen() {
  const { t } = useTranslation('social');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile, loading, error } = useFriendProfile(id);

  const showSkeleton = loading && !profile;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={[styles.back, { color: colors.textSecondary }]}>{t('friend.back')}</Text>
        </Pressable>
      </View>

      {showSkeleton ? (
        <View style={styles.content}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <ListCardSkeleton key={i} colorScheme={colorScheme} />
          ))}
        </View>
      ) : !profile ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            {error ? t('friend.error') : t('friend.notFound')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={profile.lists}
          keyExtractor={(list) => list.id}
          contentContainerStyle={styles.content}
          renderItem={({ item: list }) => (
            <ListCard
              name={list.name}
              icon={list.icon}
              color={list.color}
              description={t('friend.itemCount', { count: list.itemCount })}
              colorScheme={colorScheme}
            />
          )}
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={styles.userRow}>
                <UserAvatar
                  username={profile.user.username}
                  avatarUrl={profile.user.avatarUrl}
                  size={64}
                />
                <Text style={[styles.username, { color: colors.text }]} numberOfLines={1}>
                  {profile.user.username}
                </Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('friend.listsTitle')}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {t('friend.listsEmpty')}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  back: {
    fontSize: 15,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.two + Spacing.one,
  },
  header: {
    gap: Spacing.two,
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
