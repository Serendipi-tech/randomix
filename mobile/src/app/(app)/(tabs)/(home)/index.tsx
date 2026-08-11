import { useRouter } from 'expo-router';
import { Home, List, Plus, Shuffle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing } from '@/constants/theme';
import { resolveListIcon } from '@/constants/list-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { PageHeader } from '@/components/molecules/PageHeader';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { ListCard } from '@/components/cards/ListCard';
import { ContentCard } from '@/components/cards/ContentCard';
import { useMyLists } from '@/utils/useLists';

const SKELETON_COUNT = 6;
// altezza della pillola navbar (app-tabs.tsx, BAR_HEIGHT): duplicato qui per non toccare quel componente
const NAVBAR_HEIGHT = 68;

export default function HomeScreen() {
  const { t } = useTranslation('home');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const router = useRouter();

  const { lists, loading, error, loadMore } = useMyLists();
  const insets = useSafeAreaInsets();
  // spazio riservato in fondo alla lista pari all'altezza reale della navbar + inset di sistema, così l'ultimo elemento non resta nascosto dietro la pillola
  const listBottomPadding = NAVBAR_HEIGHT + insets.bottom + Spacing.three;

  // skeleton solo al primo caricamento, quando non c'è ancora nulla in cache
  const showSkeleton = loading && lists.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader
        icon={Home}
        title={t('title')}
        action={{ icon: Plus, onPress: () => router.push('/list-form') }}
      />

      <View style={styles.randomizerWrap}>
        <ContentCard
          variant="outlined"
          icon={Shuffle}
          title={t('randomizer')}
          description={t('randomizerSubtitle')}
          onPress={() => router.push('/randomizer')}
        />
      </View>

      {showSkeleton ? (
        <View style={styles.listContent}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <ListCardSkeleton key={i} colorScheme={colorScheme} />
          ))}
        </View>
      ) : (
        <FlatList
          style={styles.list}
          showsVerticalScrollIndicator={false}
          data={lists}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: listBottomPadding },
            lists.length === 0 && styles.listContentEmpty,
          ]}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          renderItem={({ item }) => (
            <ListCard
              title={item.name}
              category={item.categories[0]?.name}
              icon={resolveListIcon(item.icon)}
              color={item.color}
              itemsCount={item.itemCount}
              onPress={() => router.push({ pathname: '/list/[id]', params: { id: item.id } })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <EmptyState
                icon={List}
                title={error ? t('error') : t('empty.title')}
                subtitle={error ? undefined : t('empty.subtitle')}
              />
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
  randomizerWrap: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.two,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.two + Spacing.one,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
  },
});
