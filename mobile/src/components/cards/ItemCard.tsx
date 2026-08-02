import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { CardShell } from '@/components/cards/CardShell';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { RatingStar } from '@/components/atoms/RatingStar';
import { TagList } from '@/components/molecules/TagList';

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
  /** Se presente la card è cliccabile; altrimenti è statica (es. anteprima in sola lettura). */
  onPress?: () => void;
  /** Se presente, mostra la ✕ di rimozione in alto a destra. */
  onRemove?: () => void;
};

const STAR_COUNT = 5;

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

/** Card di item: categoria + stato, titolo e footer con tag e rating. L'area immagine appare solo con `imageUri`.
 *  L'intera card è cliccabile via CardShell; l'apertura del dettaglio resta al chiamante tramite `onPress`. */
export function ItemCard({ title, category, status, statusColor, imageUri, rating, tags, onPress, onRemove }: ItemCardProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const hasFooter = (tags && tags.length > 0) || rating !== undefined;
  // Numero di stelle piene arrotondato sul rating
  const filledStars = rating !== undefined ? Math.round(rating) : 0;

  return (
    <CardShell onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.body}>
          <View style={styles.header}>
            {category && (
              <Text style={[styles.category, { color: colors.textColor }]} numberOfLines={1}>
                {category}
              </Text>
            )}
            {status && <StatusBadge label={status} color={statusColor ?? resolveStatusColor(status, colors)} />}
            {onRemove && (
              <Pressable onPress={onRemove} hitSlop={8} style={styles.remove}>
                <X size={16} color={colors.disabled} />
              </Pressable>
            )}
          </View>

          <Text style={[styles.title, { color: colors.textColor }]} numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Text>

          {hasFooter && (
            <View style={styles.footer}>
              {tags && tags.length > 0 && (
                <View style={styles.tags}>
                  <TagList tags={tags} />
                </View>
              )}
              {rating !== undefined && (
                <View style={styles.rating}>
                  {Array.from({ length: STAR_COUNT }).map((_, i) => (
                    <RatingStar
                      key={i}
                      active={i < filledStars}
                      color={colors.warning}
                      inactiveColor={colors.border}
                      onPress={() => {}}
                    />
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        {imageUri && (
          <View style={[styles.imageWrap, { backgroundColor: hexToRgba(colors.primary, 0.15) }]}>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          </View>
        )}
      </View>
    </CardShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  remove: {
    padding: 2,
  },
  category: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
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
  },
  tags: {
    flex: 1,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrap: {
    width: 72,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
