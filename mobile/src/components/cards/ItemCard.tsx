import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { PLACEHOLDER_ITEM_IMAGE } from '@/constants/placeholders';
import { useAppTheme } from '@/utils/useAppTheme';
import { CardShell } from '@/components/cards/CardShell';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { TagList } from '@/components/molecules/TagList';
import { ItemCardDetails, type ItemCardDetailsProps } from '@/components/organisms/ItemCardDetails';

type ThemeColors = (typeof Colors)[keyof typeof Colors];

type ItemTag = { name: string; color: string };

type ItemCardProps = {
  title: string;
  category?: string;
  status?: string;
  /** Colore del badge di stato già risolto; se assente, dedotto dal nome dello stato. */
  statusColor?: string;
  imageUri?: string;
  rating?: number;
  tags?: ItemTag[];
  /** Dati/azioni del bottomsheet di dettaglio: se presente, il tap sulla card lo apre SEMPRE. */
  detail?: Omit<ItemCardDetailsProps, 'visible' | 'onClose'>;
  /** Tap alternativo quando la card non ha un dettaglio (es. anteprima statica). */
  onPress?: () => void;
};

const IMAGE_WIDTH = 72;
const TITLE_HEIGHT = 44;
const MAX_RATING = 5;

// Mappa neutra nome-stato -> colore del tema, nessun enum di dominio: fallback su info
function resolveStatusColor(status: string, colors: ThemeColors): string {
  const map: Record<string, string> = {
    NOT_STARTED: colors.border,
    IN_PROGRESS: colors.info,
    COMPLETED: colors.success,
    DRAFT: colors.border,
    FAILED: colors.error,
  };
  return map[status.toUpperCase()] ?? colors.info;
}

/** Card di item: categoria + stato, titolo ad altezza fissa e footer con tag e rating (stella frazionaria + valore).
 *  Colonna immagine full-bleed a destra (placeholder se senza `imageUri`). Shell condivisa (CardShell); tap gestito dal chiamante. */
export function ItemCard({ title, category, status, statusColor, imageUri, rating, tags, detail, onPress }: ItemCardProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const [detailOpen, setDetailOpen] = useState(false);

  const hasFooter = (tags && tags.length > 0) || rating !== undefined;
  // Percentuale di riempimento della stella singola in base al rating (0..MAX_RATING)
  const fillPercent = rating !== undefined ? Math.min(rating / MAX_RATING, 1) * 100 : 0;
  // Regola fissa: con un dettaglio il tap apre sempre il bottomsheet; altrimenti resta il tap del chiamante
  const handlePress = detail ? () => setDetailOpen(true) : onPress;

  return (
    <>
      <CardShell onPress={handlePress}>
      {/* Margine negativo per annullare il padding del guscio e ottenere il layout full-bleed */}
      <View style={styles.fullBleed}>
        <View style={styles.body}>
          <View style={styles.topGroup}>
            <View style={styles.header}>
              {category && (
                <Text style={[styles.category, { color: colors.textColor }]} numberOfLines={1}>
                  {category}
                </Text>
              )}
              {status && <StatusBadge label={status} color={statusColor ?? resolveStatusColor(status, colors)} />}
            </View>

            <View style={styles.titleWrap}>
              <Text style={[styles.title, { color: colors.textColor }]} numberOfLines={2} ellipsizeMode="tail">
                {title}
              </Text>
            </View>
          </View>

          {hasFooter && (
            <View style={styles.footer}>
              {tags && tags.length > 0 && (
                <View style={styles.tags}>
                  <TagList tags={tags} />
                </View>
              )}
              {rating !== undefined && (
                <View style={styles.rating}>
                  <View style={styles.starWrap}>
                    <Star size={14} color={colors.border} fill={colors.border} strokeWidth={0} style={styles.starBase} />
                    <View style={[styles.starClip, { width: `${fillPercent}%` }]}>
                      <Star size={14} color={colors.warning} fill={colors.warning} strokeWidth={0} />
                    </View>
                  </View>
                  <Text style={[styles.ratingValue, { color: colors.textColor }]}>{rating.toFixed(1)}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.imageWrap}>
          {/* Placeholder statico temporaneo quando manca imageUri (in attesa della gestione immagini) */}
          <Image source={imageUri ? { uri: imageUri } : PLACEHOLDER_ITEM_IMAGE} style={styles.image} resizeMode="cover" />
        </View>
      </View>
      </CardShell>

      {detail && <ItemCardDetails visible={detailOpen} onClose={() => setDetailOpen(false)} {...detail} />}
    </>
  );
}

const styles = StyleSheet.create({
  fullBleed: {
    margin: -16,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingLeft: 16,
  },
  topGroup: {
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  category: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
  },
  titleWrap: {
    height: TITLE_HEIGHT,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 17,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  tags: {
    flex: 1,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starWrap: {
    width: 14,
    height: 14,
  },
  starBase: {
    position: 'absolute',
  },
  starClip: {
    position: 'absolute',
    height: 14,
    overflow: 'hidden',
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  imageWrap: {
    width: IMAGE_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
