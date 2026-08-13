import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dices, Pencil, Plus } from 'lucide-react-native';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing } from '@/constants/theme';
import { resolveListIcon } from '@/constants/list-icons';
import { darkenColor, hexToRgba } from '@/utils/color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { ConfirmSheet } from '@/components/molecules/confirm-sheet';
import { PageHeader } from '@/components/molecules/PageHeader';
import { ItemCard } from '@/components/cards/ItemCard';
import { CardShell } from '@/components/cards/CardShell';
import { Button } from '@/components/atoms/Button';
import { useItemMutations } from '@/utils/useItemMutations';
import { useListDetail, type ListItemEntry } from '@/utils/useListDetail';
import { useNavbarClearance } from '@/utils/useNavbarClearance';

const SKELETON_COUNT = 5;

export default function ListDetailScreen() {
  const { t } = useTranslation('lists');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { list, loading, error } = useListDetail(id);
  const { removeItemFromList, updateUserItem, rateItem } = useItemMutations();
  // clearance in fondo alla lista per non finire sotto la pillola-navbar (regola condivisa)
  const listBottomPadding = useNavbarClearance();

  const [entryToRemove, setEntryToRemove] = useState<ListItemEntry | null>(null);

  const showSkeleton = loading && !list;

  const handleRemoveConfirmed = () => {
    if (entryToRemove) removeItemFromList(entryToRemove.id);
    setEntryToRemove(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader
        icon={resolveListIcon(list?.icon)}
        title={list?.name ?? ''}
        iconGradient={list ? [list.color, darkenColor(list.color, 0.15)] : undefined}
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
        <>
          {/* Header fisso: descrizione e azioni non scrollano, solo la lista item sotto scorre */}
          <View style={styles.fixedHeader}>
            {list.description ? (
              <CardShell variant="callout" borderColor={list.color}>
                <Text style={[styles.description, { color: colors.textColor }]}>
                  {list.description}
                </Text>
              </CardShell>
            ) : null}
            <View style={[styles.itemsBar, list.description ? styles.itemsBarSpaced : null]}>
              <View style={styles.itemsActions}>
                <View style={styles.randomizeFill}>
                  <Button
                    variant="primary"
                    icon={Dices}
                    label={t('detail.randomize')}
                    disabled={list.items.length === 0}
                    onPress={() =>
                      router.push({
                        pathname: '/draw',
                        params: { listId: id, listColor: list.color },
                      })
                    }
                  />
                </View>
                <Button
                  variant="soft"
                  icon={Plus}
                  onPress={() => router.push({ pathname: '/item-form', params: { listId: id } })}
                />
              </View>
            </View>
          </View>

          <View style={styles.listWrap}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={list.items}
              keyExtractor={(entry) => entry.id}
              contentContainerStyle={[styles.content, { paddingBottom: listBottomPadding }]}
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
                imageUri={entry.userItem.item.imageUrl ?? undefined}
                detail={{
                  imageUri: entry.userItem.item.imageUrl ?? undefined,
                  name: entry.userItem.item.name,
                  category: t(`categories.${entry.userItem.item.category}`),
                  description: entry.userItem.item.description ?? undefined,
                  userDescription: entry.userItem.description ?? undefined,
                  note: entry.userItem.note ?? undefined,
                  status: entry.userItem.status,
                  ratingValue: entry.userItem.item.myRating?.value ?? undefined,
                  ratingNote: entry.userItem.item.myRating?.note ?? undefined,
                  tags: entry.userItem.tags,
                  onChangeStatus: (status) => updateUserItem(entry.userItem.id, { status }),
                  onChangeRating: (value) => rateItem(entry.userItem.item.id, value),
                  onRemoveTag: (index) =>
                    updateUserItem(entry.userItem.id, {
                      tagIds: entry.userItem.tags.filter((_, i) => i !== index).map((tg) => tg.id),
                    }),
                  onChangeNote: (note) => updateUserItem(entry.userItem.id, { note: note || null }),
                  onRemoveFromList: () => setEntryToRemove(entry),
                }}
              />
            )}
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
            {/* Fade in cima alla lista: gli item scrollati svaniscono sotto l'header fisso. Nascosto se la lista è vuota */}
            {/* Temporaneamente rimosso su richiesta:
            {list.items.length > 0 ? (
              <LinearGradient
                pointerEvents="none"
                colors={[colors.background, hexToRgba(colors.background, 0)]}
                style={styles.topFade}
              />
            ) : null} */}
          </View>
        </>
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
  fixedHeader: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  listWrap: {
    flex: 1,
  },
  topFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 24,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.two + Spacing.one,
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
    opacity: 0.85,
  },
  itemsBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Con descrizione: metà dello spazio (30px) che il PageHeader lascia sotto di sé; senza descrizione i pulsanti restano a ridosso dell'header
  itemsBarSpaced: {
    paddingTop: 15,
  },
  itemsActions: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  randomizeFill: {
    flex: 1,
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
