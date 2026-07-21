import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Accent, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/atoms/button';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { useGroupListDraw, useGroupListMergedItems, type GroupListItem } from '@/utils/useGroupList';

const SKELETON_COUNT = 4;

export default function GroupListScreen() {
  const { t } = useTranslation('groups');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const { groupListId, listName } = useLocalSearchParams<{
    groupListId: string;
    listName?: string;
  }>();

  const { items, loading } = useGroupListMergedItems(groupListId);
  const { draw, drawing, drawnItem, resetDraw, acceptDraw, accepting } =
    useGroupListDraw(groupListId);

  const [accepted, setAccepted] = useState(false);
  const [drawError, setDrawError] = useState<string | null>(null);

  const runDraw = async (previousItemId?: string) => {
    setDrawError(null);
    try {
      await draw(previousItemId);
      setAccepted(false);
    } catch (e) {
      setDrawError((e as Error).message);
    }
  };

  const handleAccept = async () => {
    if (!drawnItem) return;
    try {
      await acceptDraw(drawnItem.id);
      setAccepted(true);
    } catch (e) {
      setDrawError((e as Error).message);
    }
  };

  const handleReset = () => {
    resetDraw();
    setAccepted(false);
    setDrawError(null);
  };

  const showSkeleton = loading && items.length === 0;

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[Accent.primary + '22', colors.background]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={[styles.back, { color: colors.textSecondary }]}>←</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {listName ?? ''}
        </Text>
        <View style={styles.topBarSpacer} />
      </View>

      {drawnItem ? (
        <View style={styles.drawResult}>
          <Animated.View entering={ZoomIn} style={[styles.drawnCard, { backgroundColor: colors.backgroundElement }]}>
            <Text style={[styles.drawnLabel, { color: colors.textSecondary }]}>
              {t('groupList.draw')}
            </Text>
            <Text style={[styles.drawnName, { color: colors.text }]}>{drawnItem.name}</Text>
            {drawnItem.description ? (
              <Text style={[styles.drawnDescription, { color: colors.textSecondary }]}>
                {drawnItem.description}
              </Text>
            ) : null}
          </Animated.View>

          {drawError && (
            <Text style={styles.errorText}>{drawError}</Text>
          )}

          {!accepted ? (
            <View style={styles.drawActions}>
              <Button
                colorScheme={colorScheme}
                label={t('groupList.accept')}
                onPress={handleAccept}
                loading={accepting}
              />
              <Button
                colorScheme={colorScheme}
                variant="secondary"
                label={t('groupList.regenerate')}
                onPress={() => runDraw(drawnItem.id)}
                loading={drawing}
                disabled={accepting}
              />
              <Button
                colorScheme={colorScheme}
                variant="secondary"
                label="↩"
                onPress={handleReset}
                disabled={drawing || accepting}
              />
            </View>
          ) : (
            <Button
              colorScheme={colorScheme}
              label="↩"
              onPress={handleReset}
            />
          )}
        </View>
      ) : (
        <>
          <View style={styles.drawBar}>
            <Text style={[styles.mergedTitle, { color: colors.textSecondary }]}>
              {t('groupList.mergedItems', { count: items.length })}
            </Text>
            <Button
              colorScheme={colorScheme}
              label={t('groupList.draw')}
              onPress={() => runDraw()}
              loading={drawing}
            />
            {drawError && (
              <Text style={styles.errorText}>{drawError}</Text>
            )}
          </View>

          {showSkeleton ? (
            <View style={styles.skeletonContainer}>
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <ListCardSkeleton key={i} colorScheme={colorScheme} />
              ))}
            </View>
          ) : items.length === 0 ? (
            <View style={styles.empty}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('groupList.empty')}
              </Text>
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item: GroupListItem) => item.id}
              contentContainerStyle={styles.itemList}
              renderItem={({ item }) => (
                <View style={[styles.itemRow, { backgroundColor: colors.backgroundElement }]}>
                  <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                  {item.description ? (
                    <Text style={[styles.itemDescription, { color: colors.textSecondary }]} numberOfLines={1}>
                      {item.description}
                    </Text>
                  ) : null}
                </View>
              )}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    gap: Spacing.two,
  },
  back: { fontSize: 24 },
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Fredoka_600SemiBold',
    textAlign: 'center',
  },
  topBarSpacer: { width: 24 },
  drawBar: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  mergedTitle: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
  },
  skeletonContainer: {
    padding: Spacing.four,
    gap: Spacing.two + Spacing.one,
  },
  itemList: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six ?? 48,
    gap: Spacing.two,
  },
  itemRow: {
    borderRadius: 14,
    padding: Spacing.three,
    gap: 2,
  },
  itemName: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
  itemDescription: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: 'Nunito_500Medium',
    textAlign: 'center',
  },
  drawResult: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    justifyContent: 'center',
    gap: Spacing.four,
  },
  drawnCard: {
    borderRadius: 24,
    padding: Spacing.five ?? 32,
    alignItems: 'center',
    gap: Spacing.two,
  },
  drawnLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
  },
  drawnName: {
    fontSize: 26,
    fontFamily: 'Fredoka_700Bold',
    textAlign: 'center',
  },
  drawnDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
  drawActions: {
    gap: Spacing.two,
  },
  errorText: {
    fontSize: 14,
    color: '#E53E3E',
    textAlign: 'center',
    fontFamily: 'Nunito_500Medium',
  },
});
