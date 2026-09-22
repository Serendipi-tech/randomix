import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { List } from 'lucide-react-native';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Colors, Spacing } from '@/constants/theme';
import { useNavbarClearance } from '@/utils/useNavbarClearance';
import { resolveListIcon } from '@/constants/list-icons';
import { hexToRgba } from '@/utils/color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { Button } from '@/components/atoms/Button';
import { PageHeader } from '@/components/molecules/PageHeader';
import { CardShell } from '@/components/cards/CardShell';
import { ItemCard } from '@/components/cards/ItemCard';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import {
  useGroupListDraw,
  useGroupListManage,
  useGroupListMergedItems,
  useGroupListSharedListIds,
  type GroupListItem,
} from '@/utils/useGroupList';
import { useMyLists } from '@/utils/useLists';

const SKELETON_COUNT = 4;

export default function GroupListScreen() {
  const { t } = useTranslation('groups');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const listBottomPadding = useNavbarClearance();

  const { groupListId, listName } = useLocalSearchParams<{
    groupListId: string;
    listName?: string;
  }>();

  const { items, loading } = useGroupListMergedItems(groupListId);
  const { draw, drawing, drawnItem, resetDraw, acceptDraw, accepting } =
    useGroupListDraw(groupListId);
  const { lists: myLists } = useMyLists();
  const { sharedIds } = useGroupListSharedListIds(groupListId);
  const { addList, removeList } = useGroupListManage(groupListId);

  const [accepted, setAccepted] = useState(false);
  const [drawError, setDrawError] = useState<string | null>(null);
  const [showManage, setShowManage] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleShare = async (listId: string, shared: boolean) => {
    setTogglingId(listId);
    try {
      if (shared) await removeList(listId);
      else await addList(listId);
    } catch (_) {
    } finally {
      setTogglingId(null);
    }
  };

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
      <RadialBackground colorScheme={colorScheme} />
      <LinearGradient
        colors={[hexToRgba(colors.accent, 0.13), colors.background]}
        style={StyleSheet.absoluteFill}
      />
      <PageHeader icon={List} title={listName ?? ''} onBack={() => router.back()} />

      {drawnItem ? (
        <View style={styles.drawResult}>
          <Animated.View entering={ZoomIn} style={[styles.drawnCard, { backgroundColor: colors.foreground }]}>
            <Text style={[styles.drawnLabel, { color: colors.textColor }]}>
              {t('groupList.draw')}
            </Text>
            <Text style={[styles.drawnName, { color: colors.textColor }]}>{drawnItem.name}</Text>
            {drawnItem.description ? (
              <Text style={[styles.drawnDescription, { color: colors.textColor }]}>
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
                label={t('groupList.accept')}
                onPress={handleAccept}
                loading={accepting}
              />
              <Button
                variant="secondary"
                label={t('groupList.regenerate')}
                onPress={() => runDraw(drawnItem.id)}
                loading={drawing}
                disabled={accepting}
              />
              <Button
                variant="secondary"
                label="↩"
                onPress={handleReset}
                disabled={drawing || accepting}
              />
            </View>
          ) : (
            <Button
              label="↩"
              onPress={handleReset}
            />
          )}
        </View>
      ) : (
        <>
          <View style={styles.drawBar}>
            <Text style={[styles.mergedTitle, { color: colors.textColor }]}>
              {t('groupList.mergedItems', { count: items.length })}
            </Text>
            <Button
              label={t('groupList.draw')}
              onPress={() => runDraw()}
              loading={drawing}
            />
            {drawError && (
              <Text style={styles.errorText}>{drawError}</Text>
            )}
          </View>

          {/* Condivisione delle proprie liste in questa GroupList */}
          <View style={styles.manageBar}>
            <Pressable onPress={() => setShowManage((v) => !v)} style={styles.manageToggle}>
              <Text style={[styles.manageTitle, { color: colors.textColor }]}>
                {t('groupList.myLists')}
              </Text>
              <Text style={[styles.manageChevron, { color: colors.textColor }]}>
                {showManage ? '▾' : '▸'}
              </Text>
            </Pressable>
            {showManage &&
              (myLists.length === 0 ? (
                <Text style={[styles.manageEmpty, { color: colors.textColor }]}>
                  {t('groupList.noLists')}
                </Text>
              ) : (
                <ScrollView
                  style={styles.manageList}
                  contentContainerStyle={styles.manageListContent}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                >
                  {myLists.map((l) => {
                    const shared = sharedIds.includes(l.id);
                    const busy = togglingId === l.id;
                    const ListIcon = resolveListIcon(l.icon);
                    return (
                      <CardShell
                        key={l.id}
                        onPress={() => {
                          if (busy) return;
                          handleToggleShare(l.id, shared);
                        }}
                      >
                        <View style={styles.manageRow}>
                          <View style={styles.manageRowNameGroup}>
                            <ListIcon size={16} color={colors.textColor} />
                            <Text style={[styles.manageRowName, { color: colors.textColor }]} numberOfLines={1}>
                              {l.name}
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.manageRowAction,
                              { color: shared ? colors.secondary : colors.primary },
                            ]}
                          >
                            {busy ? '…' : shared ? t('groupList.removeMyList') : t('groupList.addMyList')}
                          </Text>
                        </View>
                      </CardShell>
                    );
                  })}
                </ScrollView>
              ))}
          </View>

          {showSkeleton ? (
            <View style={styles.skeletonContainer}>
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <ListCardSkeleton key={i} colorScheme={colorScheme} />
              ))}
            </View>
          ) : items.length === 0 ? (
            <View style={styles.empty}>
              <Text style={[styles.emptyText, { color: colors.textColor }]}>
                {t('groupList.empty')}
              </Text>
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={items}
              keyExtractor={(item: GroupListItem) => item.id}
              contentContainerStyle={[styles.itemList, { paddingBottom: listBottomPadding }]}
              renderItem={({ item }) => (
                <ItemCard
                  title={item.name}
                  category={t(`categories.${item.category}`, { ns: 'lists' })}
                  imageUri={item.imageUrl ?? undefined}
                />
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
  drawBar: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  mergedTitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  manageBar: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  manageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  manageTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  manageChevron: {
    fontSize: 16,
    opacity: 0.7,
  },
  manageEmpty: {
    fontSize: 14,
    opacity: 0.7,
  },
  manageList: {
    maxHeight: 220,
  },
  manageListContent: {
    gap: Spacing.two,
  },
  manageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  manageRowNameGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  manageRowName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  manageRowAction: {
    fontSize: 13,
    fontWeight: '700',
  },
  skeletonContainer: {
    padding: Spacing.four,
    gap: Spacing.two + Spacing.one,
  },
  itemList: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  emptyText: {
    fontSize: 15,
    opacity: 0.7,
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
    opacity: 0.7,
  },
  drawnName: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  drawnDescription: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  drawActions: {
    gap: Spacing.two,
  },
  errorText: {
    fontSize: 14,
    color: Colors.light.error,
    textAlign: 'center',
  },
});
