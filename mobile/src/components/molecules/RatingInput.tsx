import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { RatingStar } from '@/components/atoms/RatingStar';

type RatingInputProps = {
  value: number;
  /** Se assente, la fila è di sola lettura. */
  onChange?: (value: number) => void;
  count?: number;
};

// Ritardo tra una stella e la successiva: fa scorrere il riempimento a cascata invece che tutto insieme
const STAGGER_MS = 70;

/** Fila di stelle di voto costruita su RatingStar. Al cambio di `value` avvicina `displayValue`
 *  di una unità alla volta (ogni STAGGER_MS), così le stelle si riempiono in sequenza. */
export function RatingInput({ value, onChange, count = 5 }: RatingInputProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (displayValue === value) return;
    const step = displayValue < value ? 1 : -1;
    const id = setTimeout(() => setDisplayValue(displayValue + step), STAGGER_MS);
    return () => clearTimeout(id);
  }, [value, displayValue]);

  const interactive = Boolean(onChange);

  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, i) => i + 1).map((star) => (
        <RatingStar
          key={star}
          active={star <= displayValue}
          color={colors.warning}
          inactiveColor={colors.border}
          onPress={interactive ? () => onChange?.(star) : () => {}}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
  },
});
