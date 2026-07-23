import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';

type ThemeToggleButtonProps = {
  onPress: () => void;
  colorScheme: 'light' | 'dark';
  style?: ViewStyle;
};

/** Bottone globale per alternare tema chiaro/scuro manualmente. */
export function ThemeToggleButton({ onPress, colorScheme, style }: ThemeToggleButtonProps) {
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
      <Text style={[styles.glyph, { color: isDark ? Colors.dark.titleColor : Colors.light.titleColor }]}>{isDark ? '☀' : '☾'}</Text>
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
    fontSize: 16,
    lineHeight: 20,
  },
});
