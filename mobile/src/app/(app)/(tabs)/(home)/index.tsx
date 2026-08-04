import { useRouter } from 'expo-router';
import { ChevronRight, Home, List, Plus, Shuffle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabInset, Colors, Spacing } from '@/constants/theme';
import { resolveListIcon } from '@/constants/list-icons';
import { hexToRgba } from '@/utils/color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { PageHeader } from '@/components/molecules/PageHeader';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { ListCard } from '@/components/cards/ListCard';
import { CardShell } from '@/components/cards/CardShell';
import { useMyLists } from '@/utils/useLists';

const SKELETON_COUNT = 6;

export default function HomeScreen() {
  const { t } = useTranslation('home');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const { lists, loading, error, loadMore } = useMyLists();

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
        <CardShell backgroundColor={colors.primary} borderColor="transparent" onPress={() => router.push('/randomizer')}>
          <View style={styles.randomizerRow}>
            <View style={[styles.randomizerIcon, { backgroundColor: hexToRgba(colors.textColor, 0.15) }]}>
              <Shuffle size={22} color={colors.textColor} />
            </View>
            <View style={styles.randomizerText}>
              <Text style={[styles.randomizerTitle, { color: colors.textColor }]}>{t('randomizer')}</Text>
              <Text style={[styles.randomizerSubtitle, { color: hexToRgba(colors.textColor, 0.75) }]}>
                {t('randomizerSubtitle')}
              </Text>
            </View>
            <View style={[styles.randomizerArrow, { backgroundColor: hexToRgba(colors.textColor, 0.15) }]}>
              <ChevronRight size={18} color={colors.textColor} />
            </View>
          </View>
        </CardShell>
      </View>

      {showSkeleton ? (
        <View style={styles.listContent}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <ListCardSkeleton key={i} colorScheme={colorScheme} />
          ))}
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={lists}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: BottomTabInset + Spacing.four }]}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          renderItem={({ item }) => (
            <ListCard
              title={item.name}
              category={item.description ?? undefined}
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
                actionLabel={error ? undefined : t('addList')}
                onAction={error ? undefined : () => router.push('/list-form')}
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
  randomizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  randomizerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  randomizerText: {
    flex: 1,
    gap: 2,
  },
  randomizerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  randomizerSubtitle: {
    fontSize: 13,
  },
  randomizerArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.two + Spacing.one,
  },
  empty: {
    paddingTop: Spacing.six,
    paddingHorizontal: Spacing.five,
  },
});
