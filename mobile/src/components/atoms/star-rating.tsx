import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  colorScheme: 'light' | 'dark';
}

/** Fila di 5 stelle: interattiva se onChange è presente, altrimenti solo display. */
export function StarRating({ value, onChange, size = 28, colorScheme }: StarRatingProps) {
  const colors = Colors[colorScheme];
  const emptyColor = colors.textSecondary;

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          onPress={onChange ? () => onChange(star) : undefined}
          disabled={!onChange}
          hitSlop={4}>
          <Text style={{ fontSize: size, color: star <= value ? colors.warning : emptyColor }}>
            {star <= value ? '★' : '☆'}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
  },
});
