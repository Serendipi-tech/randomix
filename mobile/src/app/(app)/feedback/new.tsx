import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { PageHeader } from '@/components/molecules/PageHeader';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { Input } from '@/components/molecules/Input';
import { Button } from '@/components/atoms/Button';
import { SegmentedControl } from '@/components/atoms/SegmentedControl';
import { FormError } from '@/components/molecules/form-error';
import { useToast } from '@/utils/useToast';
import { useFeedbacks, type FeedbackType } from '@/utils/useFeedbacks';

const TEXT_MAX_LENGTH = 3000;

/** Composizione di un feedback: schermata intera come gli altri form dell'app (list-form,
 *  item-form), non un bottomsheet — qui si scrive un testo lungo con la tastiera aperta. */
export default function NewFeedbackScreen() {
  const router = useRouter();
  const { t } = useTranslation('feedback');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const toast = useToast();

  const { createFeedback, creating } = useFeedbacks();

  const [type, setType] = useState<FeedbackType>('COMMENT');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submitFeedback = async () => {
    setSubmitError(null);
    try {
      await createFeedback({ type, title, text });
      toast.success(t('sent'));
      router.back();
    } catch (e) {
      setSubmitError((e as Error).message);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader onBack={() => router.back()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SectionHeader title={t('form.heading')} />

        <SegmentedControl
          value={type}
          onChange={setType}
          // Stessa tinta per tutte le voci, come nelle notifiche e nel profilo: cambiando scelta
          // il blocco si sposta soltanto, non cambia colore
          options={[
            { value: 'COMMENT', label: t('type.comment'), activeColor: colors.primary },
            { value: 'SUGGESTION', label: t('type.suggestion'), activeColor: colors.primary },
            { value: 'BUG', label: t('type.bug'), activeColor: colors.primary },
          ]}
        />

        <Input placeholder={t('form.titlePlaceholder')} value={title} onChangeText={setTitle} />

        <View style={styles.messageWrap}>
          <Input
            variant="textarea"
            placeholder={t('form.messagePlaceholder')}
            value={text}
            onChangeText={setText}
            maxLength={TEXT_MAX_LENGTH}
          />
          {/* Il limite esiste comunque: meglio vederlo arrivare che scoprirlo quando il testo
              smette di comparire */}
          <Text style={[styles.counter, { color: colors.disabled }]}>
            {t('form.counter', { length: text.length, max: TEXT_MAX_LENGTH })}
          </Text>
        </View>

        {submitError && <FormError message={submitError} />}

        <Button
          label={t('form.submit')}
          onPress={submitFeedback}
          loading={creating}
          disabled={text.trim().length === 0}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  messageWrap: {
    gap: Spacing.one,
  },
  counter: {
    alignSelf: 'flex-end',
    fontSize: 12,
  },
});
