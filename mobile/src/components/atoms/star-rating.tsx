import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Accent, Colors } from '@/constants/theme';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  colorScheme: 'light' | 'dark';
}

/** Fila di 5 stelle: interattiva se onChange è presente, altrimenti solo display. */
export function StarRating({ value, onChange, size = 28, colorScheme }: StarRatingProps) {
  const emptyColor = Colors[colorScheme].textSecondary;

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          onPress={onChange ? () => onChange(star) : undefined}
          disabled={!onChange}
          hitSlop={4}>
          <Text style={{ fontSize: size, color: star <= value ? Accent.yellow : emptyColor }}>
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
