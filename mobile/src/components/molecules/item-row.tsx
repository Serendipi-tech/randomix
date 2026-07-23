import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';

interface ItemRowTag {
  id: string;
  name: string;
  color: string;
}

type ItemRowStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

interface ItemRowProps {
  name: string;
  categoryLabel: string;
  status: ItemRowStatus;
  statusLabel: string;
  ratingValue?: number | null;
  tags?: ItemRowTag[];
  colorScheme: 'light' | 'dark';
  onPress: () => void;
  onRemove: () => void;
  removeLabel: string;
}

const MAX_VISIBLE_TAGS = 2;

// colore presentazionale dello stato, dai token del tema
const STATUS_COLORS: Record<ItemRowStatus, string> = {
  NOT_STARTED: 'transparent',
  IN_PROGRESS: Colors.light.warning,
  COMPLETED: Colors.light.success,
};

/** Riga di un elemento della lista: nome, categoria, stato, rating, tag e rimozione. */
export function ItemRow({
  name,
  categoryLabel,
  status,
  statusLabel,
  ratingValue,
  tags = [],
  colorScheme,
  onPress,
  onRemove,
  removeLabel,
}: ItemRowProps) {
  const colors = Colors[colorScheme];
  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenCount = tags.length - visibleTags.length;
  const statusColor = STATUS_COLORS[status];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.backgroundElement },
        pressed && styles.pressed,
      ]}>
      <View style={styles.textZone}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.meta, { color: colors.textSecondary }]} numberOfLines={1}>
            {categoryLabel}
          </Text>
          {statusColor !== 'transparent' && (
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          )}
          <Text style={[styles.meta, { color: colors.textSecondary }]} numberOfLines={1}>
            {statusLabel}
          </Text>
          {ratingValue ? (
            <Text style={[styles.rating, { color: colors.warning }]}>★ {ratingValue}</Text>
          ) : null}
        </View>
        {visibleTags.length > 0 && (
          <View style={styles.tagRow}>
            {visibleTags.map((tag) => (
              <View key={tag.id} style={[styles.tagPill, { backgroundColor: tag.color }]}>
                <Text style={styles.tagLabel} numberOfLines={1}>
                  {tag.name}
                </Text>
              </View>
            ))}
            {hiddenCount > 0 && (
              <View style={[styles.tagPill, { backgroundColor: colors.backgroundSelected }]}>
                <Text style={[styles.tagLabel, { color: colors.textSecondary }]}>
                  +{hiddenCount}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
      <Pressable
        onPress={onRemove}
        hitSlop={8}
        accessibilityLabel={removeLabel}
        style={[styles.removeButton, { backgroundColor: colors.backgroundSelected }]}>
        <Text style={[styles.removeLabel, { color: colors.textSecondary }]}>✕</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    padding: 14,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  textZone: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meta: {
    fontSize: 14,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rating: {
    fontSize: 14,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 3,
  },
  tagPill: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 10,
    maxWidth: 110,
  },
  // 12px consentito solo per i badge, come da regole tipografiche
  tagLabel: {
    fontSize: 12,
    color: Colors.light.border,
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeLabel: {
    fontSize: 14,
  },
});
