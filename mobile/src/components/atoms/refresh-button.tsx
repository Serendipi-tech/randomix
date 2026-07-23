import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';

type RefreshButtonProps = {
  onPress: () => void;
  colorScheme: 'light' | 'dark';
  style?: ViewStyle;
};

/** Piccolo tasto per rilanciare la coreografia d'ingresso (utile in sviluppo/anteprima). */
export function RefreshButton({ onPress, colorScheme, style }: RefreshButtonProps) {
  const isDark = colorScheme === 'dark';

  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={[
        styles.button,
        { backgroundColor: isDark ? hexToRgba(Colors.dark.border, 0.12) : hexToRgba(Colors.light.titleColor, 0.08) },
        style,
      ]}
    >
      <Text style={[styles.glyph, { color: isDark ? Colors.dark.titleColor : Colors.light.titleColor }]}>↻</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    fontSize: 18,
    lineHeight: 20,
  },
});
