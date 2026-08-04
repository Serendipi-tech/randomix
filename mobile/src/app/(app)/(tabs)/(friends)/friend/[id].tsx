import { useRouter, useLocalSearchParams } from 'expo-router';
import { List, Users } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { Avatar } from '@/components/atoms/Avatar';
import { PageHeader } from '@/components/molecules/PageHeader';
import { ListCard } from '@/components/cards/ListCard';
import { useFriendProfile } from '@/utils/useFriendProfile';

const SKELETON_COUNT = 3;

export default function FriendProfileScreen() {
  const { t } = useTranslation('friends');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile, loading, error } = useFriendProfile(id);

  const showSkeleton = loading && !profile;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <PageHeader icon={Users} title={profile?.user.username ?? ''} onBack={() => router.back()} />

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
          data={profile.lists}
          keyExtractor={(list) => list.id}
          contentContainerStyle={styles.content}
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
                <Avatar
                  uri={profile.user.avatarUrl ?? undefined}
                  fallbackColor={colors.primary}
                />
                <Text style={[styles.username, { color: colors.textColor }]} numberOfLines={1}>
                  {profile.user.username}
                </Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textColor }]}>
                {t('friend.listsTitle')}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: colors.textColor }]}>
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
