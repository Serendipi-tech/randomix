import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Pencil } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { SectionLabel } from '@/components/atoms/SectionLabel';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { RatingStar } from '@/components/atoms/RatingStar';
import { TagList } from '@/components/molecules/TagList';

type ItemCardDetailsProps = {
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
  onChangeStatus?: () => void;
  onChangeRating?: (value: number) => void;
  onRemoveTag?: (index: number) => void;
  onAddTag?: () => void;
  onChangeNote?: () => void;
};

const RATING_STARS = [1, 2, 3, 4, 5] as const;

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
}: ItemCardDetailsProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const showTags = Boolean(tags?.length) || Boolean(onAddTag);
  const statusBadge = status ? <StatusBadge label={status.replace(/_/g, ' ')} color={resolveStatusColor(status, colors)} /> : null;

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
            {imageUri && <Image source={{ uri: imageUri }} style={styles.cover} resizeMode="cover" />}
            <View style={styles.headerText}>
              {category && <Text style={[styles.category, { color: colors.textColor }]}>{category}</Text>}
              <Text style={[styles.name, { color: colors.textColor }]} numberOfLines={3}>
                {name}
              </Text>
            </View>
          </View>

          {statusBadge && (
            <View style={styles.section}>
              <SectionLabel>Stato</SectionLabel>
              {onChangeStatus ? <Pressable onPress={onChangeStatus}>{statusBadge}</Pressable> : statusBadge}
            </View>
          )}

          {showTags && (
            <View style={styles.section}>
              <SectionLabel>Tag</SectionLabel>
              <TagList tags={tags ?? []} expandable onRemoveTag={onRemoveTag} onAddTag={onAddTag} />
            </View>
          )}

          {description && (
            <View style={styles.textSection}>
              <SectionLabel>Descrizione</SectionLabel>
              <Text style={[styles.paragraph, { color: colors.textColor }]}>{description}</Text>
            </View>
          )}

          {userDescription && (
            <View style={styles.textSection}>
              <SectionLabel>La tua descrizione</SectionLabel>
              <Text style={[styles.paragraph, { color: colors.textColor }]}>{userDescription}</Text>
            </View>
          )}

          {/* Nota personale: pannello tintato per distinguere il contenuto editabile dall'utente */}
          <View style={[styles.notePanel, { backgroundColor: hexToRgba(colors.primary, 0.07) }]}>
            <View style={styles.noteHeader}>
              <SectionLabel>Nota personale</SectionLabel>
              <Pressable onPress={onChangeNote} hitSlop={8} style={styles.editButton}>
                <Pencil size={13} color={colors.primary} />
                <Text style={[styles.editText, { color: colors.primary }]}>Modifica</Text>
              </Pressable>
            </View>
            <Text style={[styles.paragraph, { color: colors.textColor, opacity: note ? 1 : 0.5, fontStyle: note ? 'normal' : 'italic' }]}>
              {note || 'Nessuna nota aggiunta'}
            </Text>
          </View>

          {completedAt && <Text style={[styles.completedAt, { color: colors.textColor }]}>Completato il {completedAt}</Text>}

          {/* Rating: sempre l'ultimo blocco, in evidenza — inseribile/modificabile ma mai eliminabile */}
          <View style={[styles.ratingPanel, { borderColor: hexToRgba(colors.warning, 0.35), backgroundColor: hexToRgba(colors.warning, 0.08) }]}>
            <SectionLabel>Il tuo rating</SectionLabel>
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
            <Text style={[styles.ratingValue, { color: colors.textColor }]}>
              {ratingValue !== undefined ? ratingValue.toFixed(1) : 'Tocca per valutare'}
            </Text>
            {ratingNote && <Text style={[styles.ratingNote, { color: colors.textColor }]}>“{ratingNote}”</Text>}
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
    fontSize: 11,
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
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    fontSize: 12,
    fontWeight: '600',
  },
  completedAt: {
    fontSize: 12,
    opacity: 0.5,
  },
  ratingPanel: {
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  ratingValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  ratingNote: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
