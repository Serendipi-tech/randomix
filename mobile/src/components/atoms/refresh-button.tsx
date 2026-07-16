import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

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
        { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(31,27,46,0.08)' },
        style,
      ]}
    >
      <Text style={[styles.glyph, { color: isDark ? '#F3ECFF' : '#241A3D' }]}>↻</Text>
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
