import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react-native';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { PageHeader } from '@/components/molecules/PageHeader';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ConfirmSheet } from '@/components/molecules/confirm-sheet';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { FeedbackCard } from '@/components/cards/FeedbackCard';
import { useFeedbacks } from '@/utils/useFeedbacks';

const SKELETON_COUNT = 3;

export default function FeedbackScreen() {
  const router = useRouter();
  const { t } = useTranslation('feedback');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const insets = useSafeAreaInsets();

  const { items, loading, deleteFeedback, canDelete } = useFeedbacks();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (pendingDeleteId) await deleteFeedback(pendingDeleteId);
    setPendingDeleteId(null);
  };

  const showSkeleton = loading && items.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RadialBackground colorScheme={colorScheme} />
      {/* L'invio sta nell'intestazione, non in una card in cima: resta raggiungibile anche dopo
          aver scorso la cronologia */}
      <PageHeader
        onBack={() => router.back()}
        action={{ icon: Plus, onPress: () => router.push('/feedback/new') }}
      />

      <View style={styles.headerWrap}>
        <SectionHeader title={t('history')} count={items.length} />
      </View>

      {showSkeleton ? (
        <View style={styles.skeletonWrap}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <ListCardSkeleton key={i} colorScheme={colorScheme} />
          ))}
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + Spacing.five }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState title={t('empty.title')} subtitle={t('empty.subtitle')} />}
          renderItem={({ item }) => (
            <FeedbackCard
              item={item}
              deletable={canDelete(item)}
              onDelete={() => setPendingDeleteId(item.id)}
            />
          )}
        />
      )}

      <ConfirmSheet
        visible={pendingDeleteId !== null}
        title={t('deleteConfirm.title')}
        message={t('deleteConfirm.message')}
        confirmLabel={t('deleteConfirm.confirm')}
        cancelLabel={t('cancel')}
        colorScheme={colorScheme}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Assoluto e non flex:1: con il contenuto più alto dello schermo un contenitore flex a monte
  // si rifiuta di restringersi e la lista non scorre (stesso motivo del profilo)
  safe: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  headerWrap: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  list: {
    flex: 1,
    minHeight: 0,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  skeletonWrap: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
});
