import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil } from 'lucide-react-native';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { resolveListIcon } from '@/constants/list-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { ConfirmSheet } from '@/components/molecules/confirm-sheet';
import { PageHeader } from '@/components/molecules/PageHeader';
import { ItemCard } from '@/components/cards/ItemCard';
import { Button } from '@/components/atoms/Button';
import { useItemMutations } from '@/utils/useItemMutations';
import { useListDetail, type ListItemEntry } from '@/utils/useListDetail';

const SKELETON_COUNT = 5;

export default function ListDetailScreen() {
  const { t } = useTranslation('lists');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { list, loading, error } = useListDetail(id);
  const { removeItemFromList } = useItemMutations();

  const [entryToRemove, setEntryToRemove] = useState<ListItemEntry | null>(null);

  const showSkeleton = loading && !list;

  const openItem = (entry: ListItemEntry) => {
    router.push({
      pathname: '/item-form',
      params: {
        userItemId: entry.userItem.id,
        itemId: entry.userItem.item.id,
        name: entry.userItem.item.name,
        category: entry.userItem.item.category,
        description: entry.userItem.description ?? '',
        note: entry.userItem.note ?? '',
        status: entry.userItem.status,
        rating: String(entry.userItem.item.myRating?.value ?? 0),
        ratingNote: entry.userItem.item.myRating?.note ?? '',
        tagIds: entry.userItem.tags.map((tag) => tag.id).join(','),
      },
    });
  };

  const handleRemoveConfirmed = () => {
    if (entryToRemove) removeItemFromList(entryToRemove.id);
    setEntryToRemove(null);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <PageHeader
        icon={resolveListIcon(list?.icon)}
        title={list?.name ?? ''}
        onBack={() => router.back()}
        action={
          list
            ? { icon: Pencil, onPress: () => router.push({ pathname: '/list-form', params: { id } }) }
            : undefined
        }
      />

      {showSkeleton ? (
        <View style={styles.content}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <ListCardSkeleton key={i} colorScheme={colorScheme} />
          ))}
        </View>
      ) : !list ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { color: colors.textColor }]}>
            {error ? t('detail.error') : t('detail.notFound')}
          </Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={list.items}
          keyExtractor={(entry) => entry.id}
          contentContainerStyle={styles.content}
          renderItem={({ item: entry }) => (
            <ItemCard
              title={entry.userItem.item.name}
              category={t(`categories.${entry.userItem.item.category}`)}
              status={t(`status.${entry.userItem.status}`)}
              statusColor={
                entry.userItem.status === 'IN_PROGRESS'
                  ? colors.warning
                  : entry.userItem.status === 'COMPLETED'
                    ? colors.success
                    : colors.border
              }
              rating={entry.userItem.item.myRating?.value ?? undefined}
              tags={entry.userItem.tags}
              onPress={() => openItem(entry)}
              onRemove={() => setEntryToRemove(entry)}
            />
          )}
          ListHeaderComponent={
            <View style={styles.header}>
              {list.description ? (
                <Text style={[styles.description, { color: colors.disabled }]}>
                  {list.description}
                </Text>
              ) : null}
              <View style={styles.itemsBar}>
                <Text style={[styles.sectionTitle, { color: colors.textColor }]}>
                  {t('detail.items')}
                </Text>
                <View style={styles.itemsActions}>
                  <Button
                    variant="primary"
                    label={t('detail.draw')}
                    onPress={() =>
                      router.push({
                        pathname: '/draw',
                        params: { listId: id, listColor: list.color },
                      })
                    }
                  />
                  <Button
                    variant="secondary"
                    label={t('detail.addItem')}
                    onPress={() => router.push({ pathname: '/item-form', params: { listId: id } })}
                  />
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: colors.textColor }]}>
                {t('detail.emptyTitle')}
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.disabled }]}>
                {t('detail.emptySubtitle')}
              </Text>
            </View>
          }
        />
      )}

      <ConfirmSheet
        visible={entryToRemove != null}
        title={t('detail.removeConfirmTitle')}
        message={t('detail.removeConfirmMessage')}
        confirmLabel={t('detail.remove')}
        cancelLabel={t('form.cancel')}
        colorScheme={colorScheme}
        onConfirm={handleRemoveConfirmed}
        onCancel={() => setEntryToRemove(null)}
      />
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
  description: {
    fontSize: 15,
  },
  itemsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.three,
  },
  sectionTitle: {
    fontSize: 20,
  },
  itemsActions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  addLabel: {
    fontSize: 14,
    color: Colors.light.border,
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
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});
