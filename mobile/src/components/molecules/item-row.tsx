import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';

interface ItemRowProps {
  name: string;
  categoryLabel: string;
  statusLabel: string;
  ratingValue?: number | null;
  colorScheme: 'light' | 'dark';
  onPress: () => void;
  onRemove: () => void;
  removeLabel: string;
}

/** Riga di un elemento della lista: nome, categoria, status e rimozione. */
export function ItemRow({
  name,
  categoryLabel,
  statusLabel,
  ratingValue,
  colorScheme,
  onPress,
  onRemove,
  removeLabel,
}: ItemRowProps) {
  const colors = Colors[colorScheme];

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
  removeButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  removeLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
});
