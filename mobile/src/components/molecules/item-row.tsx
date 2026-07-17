import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';

interface ItemRowTag {
  id: string;
  name: string;
  color: string;
}

interface ItemRowProps {
  name: string;
  categoryLabel: string;
  statusLabel: string;
  ratingValue?: number | null;
  tags?: ItemRowTag[];
  colorScheme: 'light' | 'dark';
  onPress: () => void;
  onRemove: () => void;
  removeLabel: string;
}

const MAX_VISIBLE_TAGS = 2;

/** Riga di un elemento della lista: nome, categoria, status e rimozione. */
export function ItemRow({
  name,
  categoryLabel,
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

  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, { backgroundColor: colors.backgroundElement }]}>
      <View style={styles.textZone}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]} numberOfLines={1}>
          {categoryLabel} · {statusLabel}
          {ratingValue ? ` · ★ ${ratingValue}` : ''}
        </Text>
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
      <Pressable onPress={onRemove} hitSlop={8} style={styles.removeButton}>
        <Text style={[styles.removeLabel, { color: colors.textSecondary }]}>{removeLabel}</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    padding: 14,
  },
  textZone: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Fredoka_600SemiBold',
  },
  meta: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
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
    color: '#fff',
    fontFamily: 'Nunito_700Bold',
  },
  removeButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  removeLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
});
