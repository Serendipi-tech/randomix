import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Accent, BottomTabInset, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { GradientBackgroundView } from '@/components/molecules/gradient-background';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { ListCard } from '@/components/molecules/list-card';
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
      <GradientBackgroundView colorScheme={colorScheme} />
      <View style={styles.titleBar}>
        <Text style={[styles.title, { color: colors.text }]}>{t('title')}</Text>
        <Pressable
          onPress={() => router.push('/list-form')}
          hitSlop={8}
          style={styles.addButton}>
          <Text style={styles.addLabel}>{t('addList')}</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => router.push('/randomizer')}
        style={({ pressed }) => [styles.randomizerCard, pressed && styles.pressed]}>
        <LinearGradient
          colors={[Accent.primary, Accent.violet]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.randomizerText}>
          <Text style={styles.randomizerTitle}>{t('randomizer')}</Text>
          <Text style={styles.randomizerSubtitle}>{t('randomizerSubtitle')}</Text>
        </View>
        <Text style={styles.randomizerArrow}>›</Text>
      </Pressable>

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
              onPress={() => router.push({ pathname: '/list/[id]', params: { id: item.id } })}
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
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  title: {
    fontSize: 28,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: Accent.violet,
  },
  addLabel: {
    fontSize: 14,
    color: '#fff',
  },
  randomizerCard: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.two,
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: Accent.violet,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 5,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  randomizerText: {
    flex: 1,
    gap: 2,
  },
  randomizerTitle: {
    fontSize: 18,
    color: '#fff',
  },
  randomizerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  randomizerArrow: {
    fontSize: 26,
    color: '#fff',
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
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});
