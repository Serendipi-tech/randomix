import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Info, Pencil, Tag as TagIcon, Trash2 } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { SectionLabel } from '@/components/atoms/SectionLabel';
import { SegmentedControl } from '@/components/atoms/SegmentedControl';
import { RatingStar } from '@/components/atoms/RatingStar';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/molecules/Input';
import { TagList } from '@/components/molecules/TagList';
import { TagPickerSheet } from '@/components/organisms/TagPickerSheet';
import type { Tag as TagData } from '@/utils/useTags';

// Tag già collegati all'item: qui basta id/name/color, non serve isSystem (solo la picker lo usa)
type AttachedTag = { id: string; name: string; color: string };

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
  tags?: AttachedTag[];
  completedAt?: string;
  onChangeStatus?: (status: ItemStatus) => void;
  onChangeRating?: (value: number) => void;
  /** Salva la nota personale; stringa vuota = cancella la nota. */
  onChangeNote?: (note: string) => void;
  /** Rimuove l'item dalla lista corrente (icona cestino in alto a destra). */
  onRemoveFromList?: () => void;
  /** Tag disponibili (personali + di sistema): se presente insieme a onSelectTag, mostra l'icona tag in alto a destra. */
  availableTags?: TagData[];
  onSelectTag?: (tag: TagData) => void;
  onCreateTag?: (name: string, color: string) => Promise<TagData | null>;
  onUpdateTag?: (id: string, name: string, color: string) => Promise<TagData | null>;
  onDeleteTag?: (tag: TagData) => Promise<void>;
  savingTag?: boolean;
  deletingTag?: boolean;
};

const RATING_STARS = [1, 2, 3, 4, 5] as const;
const NAME_MAX_LINES = 2;
// Deve combaciare con User_Item.note @db.VarChar(500) nello schema Prisma
const NOTE_MAX_LENGTH = 500;

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
  onChangeNote,
  onRemoveFromList,
  availableTags,
  onSelectTag,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
  savingTag,
  deletingTag,
}: ItemCardDetailsProps) {
  const { t } = useTranslation('lists');
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const canPickTags = Boolean(availableTags && onSelectTag);
  const showTags = Boolean(tags?.length);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const selectedTagIds = (tags ?? []).map((tag) => tag.id);

  // Rileva il troncamento confrontando l'altezza del titolo visibile (numberOfLines) con quella di una
  // copia invisibile senza limite, stessa larghezza: se la seconda è più alta, il testo è stato tagliato.
  // Uso onLayout (non onTextLayout/lines: meno affidabile sulla nuova architettura RN) per entrambe.
  const [showFullName, setShowFullName] = useState(false);
  const [headerTextWidth, setHeaderTextWidth] = useState(0);
  const [visibleNameHeight, setVisibleNameHeight] = useState(0);
  const [fullNameHeight, setFullNameHeight] = useState(0);
  const nameTruncated = fullNameHeight > visibleNameHeight + 2;

  // Modifica della nota personale: bottomsheet dedicata, non più inline
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const openNoteEditor = () => {
    setNoteDraft(note ?? '');
    setShowNoteEditor(true);
  };
  const confirmNote = () => {
    onChangeNote?.(noteDraft.trim());
    setShowNoteEditor(false);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <ScrollView
        style={[styles.scroll, Platform.OS === 'web' ? HIDE_SCROLLBAR_WEB : null]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.body}>
          {/* Categoria + azioni: riga a piena larghezza, sopra copertina/titolo */}
          {(category || canPickTags || onRemoveFromList) && (
            <View style={styles.categoryRow}>
              {category ? (
                <Text style={[styles.category, { color: colors.textColor }]}>{category}</Text>
              ) : (
                <View />
              )}
              {(canPickTags || onRemoveFromList) && (
                <View style={styles.headerActions}>
                  {canPickTags && (
                    <Pressable onPress={() => setShowTagPicker(true)} hitSlop={4} style={styles.headerActionButton}>
                      <TagIcon size={18} color={colors.textColor} />
                    </Pressable>
                  )}
                  {onRemoveFromList && (
                    <Pressable onPress={onRemoveFromList} hitSlop={4} style={styles.headerActionButton}>
                      <Trash2 size={18} color={colors.error} />
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Header: copertina "book cover" + titolo, allineati in alto */}
          <View style={styles.header}>
            {/* Cover solo se c'è un'immagine reale: niente placeholder */}
            {imageUri && <Image source={{ uri: imageUri }} style={styles.cover} resizeMode="cover" />}
            <View style={styles.headerText} onLayout={(e: LayoutChangeEvent) => setHeaderTextWidth(e.nativeEvent.layout.width)}>
              <View style={styles.nameRow}>
                <Text
                  style={[styles.name, { color: colors.textColor }]}
                  numberOfLines={NAME_MAX_LINES}
                  onLayout={(e: LayoutChangeEvent) => setVisibleNameHeight(e.nativeEvent.layout.height)}
                >
                  {name}
                </Text>
                {nameTruncated && (
                  <Pressable onPress={() => setShowFullName(true)} hitSlop={8} style={styles.infoButton}>
                    <Info size={16} color={colors.primary} />
                  </Pressable>
                )}
              </View>
              {/* Copia invisibile senza limite di righe (stessa larghezza del contenitore), solo per misurare l'altezza reale del titolo */}
              {headerTextWidth > 0 && (
                <Text
                  style={[styles.name, styles.nameMeasure, { width: headerTextWidth }]}
                  onLayout={(e: LayoutChangeEvent) => setFullNameHeight(e.nativeEvent.layout.height)}
                >
                  {name}
                </Text>
              )}
              {/* Sola lettura: aggiunta/rimozione tag avvengono solo dalla TagPickerSheet (icona qui sopra) */}
              {showTags && <TagList tags={tags ?? []} maxLines={2} />}
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

          {/* Nota personale: sola lettura qui, la modifica avviene nella bottomsheet dedicata */}
          <View
            style={[
              styles.notePanel,
              { backgroundColor: hexToRgba(colors.primary, 0.07) },
              !note && styles.notePanelEmpty,
            ]}
          >
            <View style={styles.noteHeader}>
              <SectionLabel>{t('itemDetail.note')}</SectionLabel>
              {onChangeNote && (
                <Pressable onPress={openNoteEditor} hitSlop={4} style={styles.noteEditButton}>
                  <Pencil size={16} color={colors.primary} />
                </Pressable>
              )}
            </View>
            {note ? <Text style={[styles.paragraph, { color: colors.textColor }]}>{note}</Text> : null}
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
        </View>
      </ScrollView>

      {canPickTags && onCreateTag && onUpdateTag && onDeleteTag && (
        <TagPickerSheet
          visible={showTagPicker}
          onClose={() => setShowTagPicker(false)}
          tags={availableTags ?? []}
          selectedIds={selectedTagIds}
          onSelect={(tag) => onSelectTag?.(tag)}
          onCreate={onCreateTag}
          onUpdate={onUpdateTag}
          saving={Boolean(savingTag)}
          onDelete={onDeleteTag}
          deleting={Boolean(deletingTag)}
          newTagTitle={t('itemForm.newTag')}
          editTagTitle={t('itemForm.editTag')}
          newTagPlaceholder={t('itemForm.newTagPlaceholder')}
          addLabel={t('itemForm.addTag')}
          saveLabel={t('itemForm.save')}
          searchPlaceholder={t('itemForm.tagSearchPlaceholder')}
          emptyLabel={t('itemForm.tagsEmpty')}
        />
      )}

      {nameTruncated && (
        <BottomSheet visible={showFullName} onClose={() => setShowFullName(false)}>
          <View style={styles.fullNameContent}>
            <Text style={[styles.fullNameText, { color: colors.textColor }]}>{name}</Text>
          </View>
        </BottomSheet>
      )}

      {onChangeNote && (
        <BottomSheet visible={showNoteEditor} onClose={() => setShowNoteEditor(false)}>
          <View style={styles.noteEditContent}>
            <Input
              label={t('itemDetail.note')}
              value={noteDraft}
              onChangeText={setNoteDraft}
              placeholder={t('itemDetail.notePlaceholder')}
              variant="textarea"
              maxLength={NOTE_MAX_LENGTH}
              autoFocus
            />
            <View style={styles.noteEditActions}>
              <View style={styles.noteEditAction}>
                <Button variant="secondary" label={t('itemForm.cancel')} onPress={() => setShowNoteEditor(false)} />
              </View>
              <View style={styles.noteEditAction}>
                <Button variant="primary" label={t('itemForm.save')} onPress={confirmNote} />
              </View>
            </View>
          </View>
        </BottomSheet>
      )}
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
    // Niente paddingTop: la maniglia della BottomSheet ha già il suo spazio sotto, non serve aggiungerne altro
    paddingTop: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 18,
  },
  header: {
    flexDirection: 'row',
    // Centra l'intero blocco (categoria+azioni, titolo, tag) rispetto all'altezza della copertina
    alignItems: 'center',
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
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Riduce lo spazio verso il blocco immagine+titolo sotto, senza toccare il gap tra le altre sezioni del body
    marginBottom: -16,
  },
  category: {
    opacity: 0.55,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  // Box reale ~34px, simmetrico: niente paddingTop extra da compensare più in alto
  headerActionButton: {
    padding: 8,
  },
  name: {
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 25,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  infoButton: {
    marginTop: 3,
  },
  // Copia fuori schermo, stesso stile del titolo ma senza limite righe: serve solo a onTextLayout per contare le righe reali
  nameMeasure: {
    position: 'absolute',
    opacity: 0,
    left: -9999,
  },
  fullNameContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },
  fullNameText: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
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
    // Ridotto da 8: il bottone matita (reale ~34px) lascia già ~9px "invisibili" sotto la riga header
    gap: 2,
    borderRadius: 12,
    // paddingTop ridotto: il bottone matita (reale ~34px) è più alto della label "Note", stesso motivo della categoryRow
    paddingTop: 6,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  // Senza nota non c'è testo sotto la riga: il paddingBottom pieno lascerebbe troppo spazio vuoto
  notePanelEmpty: {
    paddingBottom: 6,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Box reale ~34px (16px icona + 9px padding), non minHeight:44 come prima
  noteEditButton: {
    padding: 9,
  },
  noteEditContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  noteEditActions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  noteEditAction: {
    flex: 1,
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
});
