import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { ConfirmSheet } from '@/components/molecules/confirm-sheet';
import { ItemRow } from '@/components/molecules/item-row';
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
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={[styles.back, { color: colors.textSecondary }]}>{t('detail.back')}</Text>
        </Pressable>
        {list && (
          <Pressable onPress={() => router.push({ pathname: '/list-form', params: { id } })} hitSlop={8}>
            <Text style={[styles.edit, { color: colors.text }]}>{t('detail.edit')}</Text>
          </Pressable>
        )}
      </View>

      {showSkeleton ? (
        <View style={styles.content}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <ListCardSkeleton key={i} colorScheme={colorScheme} />
          ))}
        </View>
      ) : !list ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            {error ? t('detail.error') : t('detail.notFound')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={list.items}
          keyExtractor={(entry) => entry.id}
          contentContainerStyle={styles.content}
          renderItem={({ item: entry }) => (
            <ItemRow
              name={entry.userItem.item.name}
              categoryLabel={t(`categories.${entry.userItem.item.category}`)}
              statusLabel={t(`status.${entry.userItem.status}`)}
              ratingValue={entry.userItem.item.myRating?.value}
              colorScheme={colorScheme}
              onPress={() => openItem(entry)}
              onRemove={() => setEntryToRemove(entry)}
              removeLabel={t('detail.remove')}
            />
          )}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                {list.icon} {list.name}
              </Text>
              {list.description ? (
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                  {list.description}
                </Text>
              ) : null}
              <View style={styles.itemsBar}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {t('detail.items')}
                </Text>
                <Pressable
                  onPress={() => router.push({ pathname: '/item-form', params: { listId: id } })}
                  style={[styles.addButton, { backgroundColor: list.color }]}>
                  <Text style={styles.addLabel}>{t('detail.addItem')}</Text>
                </Pressable>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {t('detail.emptyTitle')}
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  back: {
    fontSize: 15,
    fontFamily: 'Nunito_500Medium',
  },
  edit: {
    fontSize: 15,
    fontFamily: 'Fredoka_600SemiBold',
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.two + Spacing.one,
  },
  header: {
    gap: Spacing.two,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Fredoka_700Bold',
  },
  description: {
    fontSize: 15,
    fontFamily: 'Nunito_500Medium',
  },
  itemsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.three,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Fredoka_700Bold',
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  addLabel: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Fredoka_600SemiBold',
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing.five,
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
