import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabInset, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { ListCard } from '@/components/molecules/list-card';
import { useMyLists } from '@/utils/useLists';

const SKELETON_COUNT = 6;

export default function HomeScreen() {
  const { t } = useTranslation('home');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];

  const { lists, loading, error, loadMore } = useMyLists();

  // skeleton solo al primo caricamento, quando non c'è ancora nulla in cache
  const showSkeleton = loading && lists.length === 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <Text style={[styles.title, { color: colors.text }]}>{t('title')}</Text>

      {showSkeleton ? (
        <View style={styles.listContent}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <ListCardSkeleton key={i} colorScheme={colorScheme} />
          ))}
        </View>
      ) : (
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: BottomTabInset + Spacing.four }]}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          renderItem={({ item }) => (
            <ListCard
              name={item.name}
              icon={item.icon}
              color={item.color}
              description={item.description}
              colorScheme={colorScheme}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {error ? t('error') : t('empty.title')}
              </Text>
              {!error && (
                <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                  {t('empty.subtitle')}
                </Text>
              )}
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
  title: {
    fontSize: 28,
    fontFamily: 'Fredoka_700Bold',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.two + Spacing.one,
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing.six,
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
