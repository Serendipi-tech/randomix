import { Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/theme';

interface ColorPickerRowProps {
  colors: string[];
  selected: string;
  onSelect: (color: string) => void;
  colorScheme: 'light' | 'dark';
}

/** Riga di pallini colore selezionabili per il colore della lista. */
export function ColorPickerRow({ colors, selected, onSelect, colorScheme }: ColorPickerRowProps) {
  const ringColor = Colors[colorScheme].text;

  return (
    <View style={styles.row}>
      {colors.map((color) => (
        <Pressable
          key={color}
          onPress={() => onSelect(color)}
          style={[styles.ring, selected === color && { borderColor: ringColor }]}>
          <View style={[styles.dot, { backgroundColor: color }]} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  ring: {
    padding: 3,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
});
