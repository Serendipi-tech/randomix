import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MessageSquare } from 'lucide-react-native';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { PageHeader } from '@/components/molecules/PageHeader';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/molecules/Input';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ConfirmSheet } from '@/components/molecules/confirm-sheet';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { SegmentedControl } from '@/components/atoms/SegmentedControl';
import { SectionLabel } from '@/components/atoms/SectionLabel';
import { CardShell } from '@/components/cards/CardShell';
import { FeedbackCard } from '@/components/cards/FeedbackCard';
import { useFeedbackMock, type FeedbackType } from '@/utils/useFeedbackMock';

export default function FeedbackScreen() {
  const router = useRouter();
  const { t } = useTranslation('feedback');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];

  const { items, createFeedback, deleteFeedback, canDelete } = useFeedbackMock();

  const [formOpen, setFormOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>('COMMENT');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const resetForm = () => {
    setType('COMMENT');
    setTitle('');
    setText('');
  };

  const submitFeedback = () => {
    createFeedback({ type, title, text });
    resetForm();
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (pendingDeleteId) deleteFeedback(pendingDeleteId);
    setPendingDeleteId(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader icon={MessageSquare} title={t('title')} onBack={() => router.back()} />
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <CardShell backgroundColor={colors.foreground} borderColor={colors.border}>
            <View style={styles.actionSection}>
              <Text style={[styles.banner, { color: colors.disabled }]}>{t('banner')}</Text>
              <Button label={t('send')} onPress={() => setFormOpen(true)} />
            </View>
          </CardShell>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.listWrap}>
          <SectionLabel>{t('history')}</SectionLabel>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <EmptyState icon={MessageSquare} title={t('empty.title')} subtitle={t('empty.subtitle')} />
            }
            renderItem={({ item }) => (
              <FeedbackCard
                item={item}
                deletable={canDelete(item)}
                onDelete={() => setPendingDeleteId(item.id)}
              />
            )}
          />
        </Animated.View>
      </View>

      <BottomSheet visible={formOpen} onClose={() => setFormOpen(false)}>
        <View style={styles.form}>
          <SegmentedControl
            value={type}
            onChange={setType}
            options={[
              { value: 'COMMENT', label: t('type.comment') },
              { value: 'SUGGESTION', label: t('type.suggestion'), activeColor: colors.warning },
              { value: 'BUG', label: t('type.bug'), activeColor: colors.error },
            ]}
          />
          <Input placeholder={t('form.titlePlaceholder')} value={title} onChangeText={setTitle} />
          <Input
            variant="textarea"
            placeholder={t('form.messagePlaceholder')}
            value={text}
            onChangeText={setText}
            maxLength={3000}
          />
          <Button label={t('form.submit')} onPress={submitFeedback} disabled={text.trim().length === 0} />
        </View>
      </BottomSheet>

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
  safe: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  actionSection: {
    gap: 12,
  },
  banner: {
    fontSize: 14,
  },
  listWrap: {
    flex: 1,
    gap: Spacing.two,
  },
  list: {
    gap: Spacing.two,
    paddingBottom: Spacing.six,
  },
  form: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
});
