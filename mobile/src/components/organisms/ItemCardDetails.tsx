import { useEffect, useState } from 'react';
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
import { ChevronDown, ChevronUp, Info, Pencil, Tag as TagIcon, Trash2 } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { SectionLabel } from '@/components/atoms/SectionLabel';
import { SegmentedControl } from '@/components/atoms/SegmentedControl';
import { Rating } from '@/components/atoms/Rating';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/molecules/Input';
import { TagList } from '@/components/molecules/TagList';
import { ExpandableText } from '@/components/molecules/ExpandableText';
import { DescriptionTabs } from '@/components/molecules/DescriptionTabs';
import { TagPickerSheet } from '@/components/organisms/TagPickerSheet';
import { RatingSheet } from '@/components/organisms/RatingSheet';
import type { Tag as TagData } from '@/utils/useTags';
import type { Review } from '@/utils/useItemRatings';

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
  /** Imposta/modifica il voto. Non è previsto cancellare il rating: una volta impostato si può solo
   *  aumentare/diminuire. Il testo del giudizio resta invece sempre facoltativo. */
  onChangeRating?: (value: number, note?: string) => void;
  /** Apertura/chiusura della sheet di rating controllata dal chiamante: la query di media/recensioni
   *  (dati collettivi, non solo miei) deve partire solo quando questa sheet è aperta, e vive fuori da
   *  questo componente (niente GraphQL nelle UI component). */
  ratingEditorVisible?: boolean;
  onRatingEditorVisibleChange?: (visible: boolean) => void;
  averageRating?: number | null;
  ratingsCount?: number;
  reviews?: Review[];
  reviewsLoading?: boolean;
  /** Salva la nota personale; stringa vuota = cancella la nota. */
  onChangeNote?: (note: string) => void;
  /** Salva la descrizione personale; stringa vuota = cancella la descrizione. */
  onChangeDescription?: (description: string) => void;
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

const NAME_MAX_LINES = 2;
// Deve combaciare con User_Item.note @db.VarChar(500) nello schema Prisma
const NOTE_MAX_LENGTH = 500;
// Deve combaciare con User_Item.description @db.VarChar(500) nello schema Prisma
const DESCRIPTION_MAX_LENGTH = 500;

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
  ratingEditorVisible,
  onRatingEditorVisibleChange,
  averageRating,
  ratingsCount,
  reviews,
  reviewsLoading,
  onChangeNote,
  onChangeDescription,
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

  // Espansione della nota personale (max 3 righe di default, freccia accanto alla matita)
  const [noteExpanded, setNoteExpanded] = useState(false);
  const [noteTruncated, setNoteTruncated] = useState(false);
  useEffect(() => setNoteExpanded(false), [note]);

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

  // Modifica della descrizione personale: stessa bottomsheet dedicata della nota
  const [showDescriptionEditor, setShowDescriptionEditor] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState('');
  const openDescriptionEditor = () => {
    setDescriptionDraft(userDescription ?? '');
    setShowDescriptionEditor(true);
  };
  const confirmDescription = () => {
    onChangeDescription?.(descriptionDraft.trim());
    setShowDescriptionEditor(false);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <ScrollView
        style={[styles.scroll, Platform.OS === 'web' ? HIDE_SCROLLBAR_WEB : null]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.body}>
          {/* Categoria + rating compatto + azioni: riga a piena larghezza, sopra copertina/titolo */}
          {(category || canPickTags || onRemoveFromList || onChangeRating) && (
            <View style={styles.categoryRow}>
              {category ? (
                <Text style={[styles.category, { color: colors.textColor }]}>{category}</Text>
              ) : (
                <View />
              )}
              {(canPickTags || onRemoveFromList || onChangeRating) && (
                <View style={styles.headerRight}>
                  {onChangeRating && (
                    <Rating
                      variant="medium"
                      value={ratingValue}
                      color={colors.warning}
                      inactiveColor={colors.border}
                      onPress={() => onRatingEditorVisibleChange?.(true)}
                    />
                  )}
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

          {(description || userDescription || onChangeDescription) && (
            <View
              style={[
                styles.textSection,
                styles.descriptionSection,
                !description && !userDescription && styles.descriptionSectionEmpty,
              ]}
            >
              <DescriptionTabs
                generalLabel={t('itemDetail.description')}
                personalLabel={t('itemDetail.yourDescription')}
                generalText={description}
                personalText={userDescription}
                onEditPersonal={onChangeDescription ? openDescriptionEditor : undefined}
                textStyle={[styles.paragraph, { color: colors.textColor }]}
              />
            </View>
          )}

          {status && (
            <View style={styles.section}>
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

          {/* Nota personale: stesso stile della descrizione (niente sfondo/padding dedicati), sola lettura
              qui, la modifica avviene nella bottomsheet dedicata */}
          <View style={[styles.textSection, styles.noteSection]}>
            <View style={styles.noteHeader}>
              <SectionLabel>{t('itemDetail.note')}</SectionLabel>
              <View style={styles.noteHeaderActions}>
                {noteTruncated && (
                  <Pressable onPress={() => setNoteExpanded((v) => !v)} hitSlop={4} style={styles.noteEditButton}>
                    {noteExpanded ? (
                      <ChevronUp size={16} color={colors.primary} />
                    ) : (
                      <ChevronDown size={16} color={colors.primary} />
                    )}
                  </Pressable>
                )}
                {onChangeNote && (
                  <Pressable onPress={openNoteEditor} hitSlop={4} style={styles.noteEditButton}>
                    <Pencil size={16} color={colors.primary} />
                  </Pressable>
                )}
              </View>
            </View>
            {note ? (
              <ExpandableText
                text={note}
                style={[styles.paragraph, { color: colors.textColor }]}
                expanded={noteExpanded}
                onTruncatedChange={setNoteTruncated}
              />
            ) : null}
          </View>

          {completedAt && (
            <Text style={[styles.completedAt, { color: colors.textColor }]}>
              {t('itemDetail.completedAt', { date: completedAt })}
            </Text>
          )}
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

      {onChangeDescription && (
        <BottomSheet visible={showDescriptionEditor} onClose={() => setShowDescriptionEditor(false)}>
          <View style={styles.noteEditContent}>
            <Input
              label={t('itemDetail.yourDescription')}
              value={descriptionDraft}
              onChangeText={setDescriptionDraft}
              placeholder={t('itemDetail.descriptionPlaceholder')}
              variant="textarea"
              maxLength={DESCRIPTION_MAX_LENGTH}
              autoFocus
            />
            <View style={styles.noteEditActions}>
              <View style={styles.noteEditAction}>
                <Button variant="secondary" label={t('itemForm.cancel')} onPress={() => setShowDescriptionEditor(false)} />
              </View>
              <View style={styles.noteEditAction}>
                <Button variant="primary" label={t('itemForm.save')} onPress={confirmDescription} />
              </View>
            </View>
          </View>
        </BottomSheet>
      )}

      {onChangeRating && (
        <RatingSheet
          visible={Boolean(ratingEditorVisible)}
          onClose={() => onRatingEditorVisibleChange?.(false)}
          ratingValue={ratingValue}
          ratingNote={ratingNote}
          onChangeRating={onChangeRating}
          averageRating={averageRating ?? null}
          ratingsCount={ratingsCount ?? 0}
          reviews={reviews ?? []}
          reviewsLoading={Boolean(reviewsLoading)}
        />
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
  // Stelle compatte (rating) + bottoni azione, ravvicinati fra loro come un unico gruppo a destra
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  // Il titolo di DescriptionTabs ha bottoni reali (~34px) più alti della label: senza compenso lo
  // spazio verso il blocco sopra sembra maggiore che altrove, stesso motivo di noteSection sotto
  descriptionSection: {
    marginTop: -8,
  },
  // Senza testo (né generale né personale) resta solo la riga del titolo: stesso bottone che gonfia
  // l'altezza sotto la label, quindi senza testo che lo assorba lo spazio verso lo status sotto sembra doppio
  descriptionSectionEmpty: {
    marginBottom: -8,
  },
  // L'header (freccia+matita, box reale ~34px) è più alto della label: senza compenso il gap dal
  // divider sopra sembra maggiore che dall'altra parte, dove non c'è nessun bottone appena sotto.
  // gap:0 sovrascrive quello di textSection: DescriptionTabs non ha alcun gap esplicito fra titolo
  // e testo (solo l'inflazione del bottone), qui deve valere la stessa cosa per restare simmetrico
  noteSection: {
    marginTop: -8,
    gap: 0,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Niente gap: freccia e matita ravvicinate, come le icone nell'header di DescriptionTabs
  noteHeaderActions: {
    flexDirection: 'row',
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
});
