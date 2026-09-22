import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { ChevronDown, ChevronUp, Pencil } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import type { Review } from '@/utils/useItemRatings';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { Rating } from '@/components/atoms/Rating';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/molecules/Input';
import { ExpandableText } from '@/components/molecules/ExpandableText';
import { UserAvatar } from '@/components/atoms/user-avatar';

export type RatingSheetProps = {
  visible: boolean;
  onClose: () => void;
  ratingValue?: number;
  ratingNote?: string;
  /** Non è previsto cancellare il rating: una volta impostato si può solo aumentare/diminuire. */
  onChangeRating: (value: number, note?: string) => void;
  averageRating: number | null;
  ratingsCount: number;
  reviews: Review[];
  reviewsLoading: boolean;
};

// Deve combaciare con Rating.note @db.VarChar(1000) nello schema Prisma
const RATING_NOTE_MAX_LENGTH = 1000;

// Nasconde la scrollbar solo su web (proprietà non tipizzata in RN)
const HIDE_SCROLLBAR_WEB = { scrollbarWidth: 'none' } as unknown as StyleProp<ViewStyle>;

/** Bottomsheet del rating: tab "personale" (primaria, aperta di default — editor con stelle grandi + nota)
 *  e tab secondaria "generale" (media di tutti + elenco recensioni, amici prima; dati già caricati dal
 *  chiamante, sola visualizzazione). Cancel/Save restano fissi sotto, valgono sempre per la propria bozza. */
export function RatingSheet({
  visible,
  onClose,
  ratingValue,
  ratingNote,
  onChangeRating,
  averageRating,
  ratingsCount,
  reviews,
  reviewsLoading,
}: RatingSheetProps) {
  const { t } = useTranslation('lists');
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const [draftValue, setDraftValue] = useState(0);
  const [draftNote, setDraftNote] = useState('');
  // La propria sezione è quella primaria: la generale è secondaria, in una tab interna
  const [activeTab, setActiveTab] = useState<'personal' | 'general'>('personal');
  // La recensione è secondaria rispetto al voto: campo nascosto finché non c'è già una nota o la si apre a comando
  const [showNoteInput, setShowNoteInput] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // La sheet risale con la tastiera (BottomSheet), ma con contenuto alto (tab + stelle) l'input recensione
  // può restare comunque sotto la tastiera: scrollo in fondo quando compare, dopo che il layout si aggiorna
  useEffect(() => {
    if (!showNoteInput) return;
    const id = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(id);
  }, [showNoteInput]);

  useEffect(() => {
    if (!visible) return;
    setDraftValue(ratingValue ?? 0);
    setDraftNote(ratingNote ?? '');
    setActiveTab('personal');
    setShowNoteInput(Boolean(ratingNote));
  }, [visible, ratingValue, ratingNote]);

  const confirm = () => {
    if (draftValue < 1) return;
    onChangeRating(draftValue, draftNote.trim() || undefined);
    onClose();
  };

  const activeColor = colors.primary;
  const inactiveColor = hexToRgba(colors.textColor, 0.5);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <ScrollView
        ref={scrollRef}
        style={[styles.scroll, Platform.OS === 'web' ? HIDE_SCROLLBAR_WEB : null]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.tabsRow}>
            <Pressable onPress={() => setActiveTab('personal')} hitSlop={4} style={styles.tabButton}>
              <Text style={[styles.tabTitle, { color: activeTab === 'personal' ? activeColor : inactiveColor }]}>
                {t('itemDetail.ratingPersonal')}
              </Text>
            </Pressable>
            <Pressable onPress={() => setActiveTab('general')} hitSlop={4} style={styles.tabButton}>
              <Text style={[styles.tabTitle, { color: activeTab === 'general' ? activeColor : inactiveColor }]}>
                {t('itemDetail.ratingGeneral')}
              </Text>
            </Pressable>
          </View>

          {activeTab === 'personal' ? (
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
          ) : (
            <View style={styles.section}>
              <View style={styles.averageRow}>
                <Rating variant="compact" value={averageRating ?? 0} color={colors.warning} inactiveColor={colors.border} />
                <Text style={[styles.count, { color: colors.textColor }]}>
                  {t('itemDetail.ratingsCount', { count: ratingsCount })}
                </Text>
              </View>

              {reviewsLoading ? (
                <ActivityIndicator color={colors.primary} style={styles.loading} />
              ) : reviews.length === 0 ? (
                <Text style={[styles.empty, { color: colors.textColor }]}>{t('itemDetail.noReviews')}</Text>
              ) : (
                <View style={styles.reviewsList}>
                  {reviews.map((review) => (
                    <ReviewRow key={review.id} review={review} />
                  ))}
                </View>
              )}
            </View>
          )}

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

/** Riga di una recensione altrui: avatar, username, stelle (sola visualizzazione) e nota troncata a 3 righe. */
function ReviewRow({ review }: { review: Review }) {
  const { t } = useTranslation('lists');
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);
  useEffect(() => setExpanded(false), [review.note]);

  const username = review.user?.username ?? t('itemDetail.deletedUser');

  return (
    <View style={styles.reviewRow}>
      <UserAvatar username={username} avatarUrl={review.user?.avatarUrl ?? null} size={32} />
      <View style={styles.reviewBody}>
        <View style={styles.reviewHeader}>
          <Text style={[styles.reviewUsername, { color: colors.textColor }]} numberOfLines={1}>
            {username}
          </Text>
          <View style={styles.reviewHeaderRight}>
            {truncated && (
              <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={4} style={styles.reviewExpandButton}>
                {expanded ? <ChevronUp size={14} color={colors.primary} /> : <ChevronDown size={14} color={colors.primary} />}
              </Pressable>
            )}
            <Rating variant="medium" value={review.value} color={colors.warning} inactiveColor={colors.border} />
          </View>
        </View>
        {review.note ? (
          <ExpandableText
            text={review.note}
            style={[styles.reviewNote, { color: colors.textColor }]}
            expanded={expanded}
            onTruncatedChange={setTruncated}
          />
        ) : null}
      </View>
    </View>
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
  tabsRow: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
  tabButton: {
    paddingVertical: 8,
  },
  tabTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  averageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  count: {
    fontSize: 14,
    opacity: 0.6,
  },
  loading: {
    marginTop: Spacing.two,
  },
  empty: {
    fontSize: 14,
    opacity: 0.6,
  },
  reviewsList: {
    gap: Spacing.three,
  },
  reviewRow: {
    flexDirection: 'row',
    gap: 10,
  },
  reviewBody: {
    flex: 1,
    gap: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  reviewUsername: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  reviewHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewExpandButton: {
    padding: 8,
  },
  reviewNote: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  action: {
    flex: 1,
  },
});
