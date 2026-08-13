import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { SectionLabel } from '@/components/atoms/SectionLabel';
import { SegmentedControl } from '@/components/atoms/SegmentedControl';
import { RatingStar } from '@/components/atoms/RatingStar';
import { Input } from '@/components/molecules/Input';
import { TagList } from '@/components/molecules/TagList';

export type ItemCardDetailsProps = {
  visible: boolean;
  onClose: () => void;
  imageUri?: string;
  name: string;
  category?: string;
  description?: string; // descrizione generale dell'item
  userDescription?: string; // descrizione personale dell'utente
  note?: string;
  status?: string;
  ratingValue?: number;
  ratingNote?: string;
  tags?: Array<{ name: string; color: string }>;
  completedAt?: string;
  onChangeStatus?: (status: ItemStatus) => void;
  onChangeRating?: (value: number) => void;
  onRemoveTag?: (index: number) => void;
  onAddTag?: () => void;
  /** Salva la nota personale; stringa vuota = cancella la nota. */
  onChangeNote?: (note: string) => void;
  /** Rimuove l'item dalla lista corrente (l'azione ✕ vive qui, non sulla card). */
  onRemoveFromList?: () => void;
};

const RATING_STARS = [1, 2, 3, 4, 5] as const;

type ItemStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
// Stati mostrati nel segmented control, in ordine di avanzamento
const STATUS_KEYS: ItemStatus[] = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];

// Nasconde la scrollbar solo su web (proprietà non tipizzata in RN)
const HIDE_SCROLLBAR_WEB = { scrollbarWidth: 'none' } as unknown as StyleProp<ViewStyle>;

/** Risolve il colore dello stato in modo neutro, senza conoscere gli enum Prisma:
 *  mappa locale nome→ruolo del tema, con fallback su `info`. */
function resolveStatusColor(status: string, colors: { border: string; info: string; success: string }): string {
  const map: Record<string, string> = {
    NOT_STARTED: colors.border,
    IN_PROGRESS: colors.info,
    COMPLETED: colors.success,
  };
  return map[status] ?? colors.info;
}

/** Bottomsheet di dettaglio di un item: copertina, stato, tag, descrizioni, nota personale e rating.
 *  Contenitore e animazione di slide delegati a BottomSheet; il tema è letto internamente. */
export function ItemCardDetails({
  visible,
  onClose,
  imageUri,
  name,
  category,
  description,
  userDescription,
  note,
  status,
  ratingValue,
  ratingNote,
  tags,
  completedAt,
  onChangeStatus,
  onChangeRating,
  onRemoveTag,
  onAddTag,
  onChangeNote,
  onRemoveFromList,
}: ItemCardDetailsProps) {
  const { t } = useTranslation('lists');
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const showTags = Boolean(tags?.length) || Boolean(onAddTag);

  // Editing inline della nota personale
  const [noteEditing, setNoteEditing] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const startNoteEdit = () => {
    setNoteDraft(note ?? '');
    setNoteEditing(true);
  };
  const confirmNote = () => {
    onChangeNote?.(noteDraft.trim());
    setNoteEditing(false);
  };
  const cancelNote = () => setNoteEditing(false);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <ScrollView
        style={[styles.scroll, Platform.OS === 'web' ? HIDE_SCROLLBAR_WEB : null]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.body}>
          {/* Header: copertina "book cover" + titolo, allineati in alto */}
          <View style={styles.header}>
            {/* Cover solo se c'è un'immagine reale: niente placeholder */}
            {imageUri && <Image source={{ uri: imageUri }} style={styles.cover} resizeMode="cover" />}
            <View style={styles.headerText}>
              {category && <Text style={[styles.category, { color: colors.textColor }]}>{category}</Text>}
              <Text style={[styles.name, { color: colors.textColor }]} numberOfLines={3}>
                {name}
              </Text>
            </View>
          </View>

          {status && (
            <View style={styles.section}>
              <SectionLabel>{t('itemDetail.status')}</SectionLabel>
              <SegmentedControl
                value={status as ItemStatus}
                onChange={(next) => onChangeStatus?.(next)}
                options={STATUS_KEYS.map((key) => ({
                  value: key,
                  label: t(`status.${key}`),
                  activeColor: resolveStatusColor(key, colors),
                }))}
              />
            </View>
          )}

          {showTags && (
            <View style={styles.section}>
              <SectionLabel>{t('itemDetail.tags')}</SectionLabel>
              <TagList tags={tags ?? []} expandable onRemoveTag={onRemoveTag} onAddTag={onAddTag} />
            </View>
          )}

          {description && (
            <View style={styles.textSection}>
              <SectionLabel>{t('itemDetail.description')}</SectionLabel>
              <Text style={[styles.paragraph, { color: colors.textColor }]}>{description}</Text>
            </View>
          )}

          {userDescription && (
            <View style={styles.textSection}>
              <SectionLabel>{t('itemDetail.yourDescription')}</SectionLabel>
              <Text style={[styles.paragraph, { color: colors.textColor }]}>{userDescription}</Text>
            </View>
          )}

          {/* Nota personale: editing inline — +/matita per aprire, ✓/✗ per confermare/annullare */}
          <View style={[styles.notePanel, { backgroundColor: hexToRgba(colors.primary, 0.07) }]}>
            <View style={styles.noteHeader}>
              <SectionLabel>{t('itemDetail.note')}</SectionLabel>
              {onChangeNote &&
                (noteEditing ? (
                  <View style={styles.noteActions}>
                    <Pressable onPress={confirmNote} hitSlop={8} style={styles.iconButton}>
                      <Check size={22} color={colors.success} />
                    </Pressable>
                    <Pressable onPress={cancelNote} hitSlop={8} style={styles.iconButton}>
                      <X size={22} color={colors.error} />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable onPress={startNoteEdit} hitSlop={8} style={styles.iconButton}>
                    {note ? <Pencil size={20} color={colors.primary} /> : <Plus size={24} color={colors.primary} />}
                  </Pressable>
                ))}
            </View>
            {noteEditing ? (
              <Input value={noteDraft} onChangeText={setNoteDraft} placeholder={t('itemDetail.notePlaceholder')} variant="textarea" />
            ) : note ? (
              <Text style={[styles.paragraph, { color: colors.textColor }]}>{note}</Text>
            ) : null}
          </View>

          {completedAt && (
            <Text style={[styles.completedAt, { color: colors.textColor }]}>
              {t('itemDetail.completedAt', { date: completedAt })}
            </Text>
          )}

          {/* Rating: label e stelle in space-between, il giudizio sotto */}
          <View style={styles.section}>
            <View style={styles.ratingHeader}>
              <SectionLabel>{t('itemDetail.rating')}</SectionLabel>
              <View style={styles.starsRow}>
                {RATING_STARS.map((n) => (
                  <RatingStar
                    key={n}
                    active={n <= Math.round(ratingValue ?? 0)}
                    color={colors.warning}
                    inactiveColor={colors.border}
                    onPress={() => onChangeRating?.(n)}
                  />
                ))}
              </View>
            </View>
            {ratingNote ? (
              <Text style={[styles.ratingNote, { color: colors.textColor }]}>“{ratingNote}”</Text>
            ) : null}
          </View>

          {onRemoveFromList && (
            <Pressable onPress={onRemoveFromList} hitSlop={8} style={styles.removeRow}>
              <Trash2 size={16} color={colors.error} />
              <Text style={[styles.removeText, { color: colors.error }]}>{t('itemDetail.remove')}</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  body: {
    padding: 16,
    gap: 18,
  },
  header: {
    flexDirection: 'row',
    gap: 14,
  },
  cover: {
    width: 92,
    height: 122,
    borderRadius: 10,
  },
  headerText: {
    flex: 1,
    gap: 6,
    paddingTop: 2,
  },
  category: {
    opacity: 0.55,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 25,
  },
  section: {
    gap: 6,
  },
  textSection: {
    gap: 4,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
  },
  notePanel: {
    gap: 8,
    borderRadius: 12,
    padding: 12,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // Area tattile comoda per le icone d'azione (+/matita/✓/✗)
  iconButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedAt: {
    fontSize: 12,
    opacity: 0.5,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  ratingNote: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  removeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
  },
  removeText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
