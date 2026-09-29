import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Pencil } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { Rating } from '@/components/atoms/Rating';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/molecules/Input';

export type RatingSheetProps = {
  visible: boolean;
  onClose: () => void;
  ratingValue?: number;
  ratingNote?: string;
  /** Non è previsto cancellare il rating: una volta impostato si può solo aumentare/diminuire. */
  onChangeRating: (value: number, note?: string) => void;
};

// Deve combaciare con Rating.note @db.VarChar(1000) nello schema Prisma
const RATING_NOTE_MAX_LENGTH = 1000;

// Nasconde la scrollbar solo su web (proprietà non tipizzata in RN)
const HIDE_SCROLLBAR_WEB = { scrollbarWidth: 'none' } as unknown as StyleProp<ViewStyle>;

/** Bottomsheet del voto personale: stelle grandi + nota facoltativa. */
export function RatingSheet({ visible, onClose, ratingValue, ratingNote, onChangeRating }: RatingSheetProps) {
  const { t } = useTranslation('lists');
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const [draftValue, setDraftValue] = useState(0);
  const [draftNote, setDraftNote] = useState('');
  // La nota è secondaria rispetto al voto: campo nascosto finché non c'è già una nota o la si apre a comando
  const [showNoteInput, setShowNoteInput] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // La sheet risale con la tastiera (BottomSheet), ma con contenuto alto (stelle) l'input nota può
  // restare comunque sotto: scrollo in fondo quando compare, dopo che il layout si aggiorna
  useEffect(() => {
    if (!showNoteInput) return;
    const id = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(id);
  }, [showNoteInput]);

  useEffect(() => {
    if (!visible) return;
    setDraftValue(ratingValue ?? 0);
    setDraftNote(ratingNote ?? '');
    setShowNoteInput(Boolean(ratingNote));
  }, [visible, ratingValue, ratingNote]);

  const confirm = () => {
    if (draftValue < 1) return;
    onChangeRating(draftValue, draftNote.trim() || undefined);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <ScrollView
        ref={scrollRef}
        style={[styles.scroll, Platform.OS === 'web' ? HIDE_SCROLLBAR_WEB : null]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.starsCenter}>
              <Rating
                variant="extended"
                value={draftValue}
                color={colors.warning}
                inactiveColor={colors.border}
                onChange={setDraftValue}
              />
              {draftValue > 0 && (
                <Text style={[styles.valueLabel, { color: colors.textColor }]}>
                  {t('itemDetail.ratingValue', { value: draftValue })}
                </Text>
              )}
            </View>

            {showNoteInput ? (
              <Input
                label={t('itemDetail.ratingNote')}
                value={draftNote}
                onChangeText={setDraftNote}
                placeholder={t('itemDetail.ratingNotePlaceholder')}
                variant="textarea"
                maxLength={RATING_NOTE_MAX_LENGTH}
                autoFocus
              />
            ) : (
              <Pressable onPress={() => setShowNoteInput(true)} hitSlop={4} style={styles.addReviewLink}>
                <Pencil size={14} color={colors.primary} />
                <Text style={[styles.addReviewText, { color: colors.primary }]}>{t('itemDetail.addReview')}</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.actions}>
            <View style={styles.action}>
              <Button variant="secondary" label={t('itemForm.cancel')} onPress={onClose} />
            </View>
            <View style={styles.action}>
              <Button variant="primary" label={t('itemForm.save')} onPress={confirm} disabled={draftValue < 1} />
            </View>
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  section: {
    gap: Spacing.two,
  },
  starsCenter: {
    alignItems: 'center',
    gap: 8,
  },
  valueLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.6,
  },
  addReviewLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  addReviewText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  action: {
    flex: 1,
  },
});
