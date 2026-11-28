import { useEffect } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba, isLightColor } from '@/utils/color';

// Stesso criterio di Badge.tsx: l'inchiostro dipende dalla tinta passata (arbitraria), non dal tema
const DARK_INK = Colors.dark.background;
const LIGHT_INK = Colors.dark.textColor;
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type StickerVariant = 'die' | 'star' | 'dot' | 'chip';

type StickerShapeProps = {
  variant: StickerVariant;
  color: string;
  size?: number;
  rotation?: number;
  label?: string;
  style?: ViewStyle;
  float?: boolean;
};

/** Piccola forma piatta in stile "sticker" (dado, stella, pallino, tessera), riusata come decorazione a tema randomizzatore. */
export function StickerShape({
  variant,
  color,
  size = 40,
  rotation = 0,
  label,
  style,
  float = true,
}: StickerShapeProps) {
  const bob = useSharedValue(0);

  useEffect(() => {
    if (!float) return;
    bob.value = withRepeat(
      withTiming(1, { duration: 2600 + size * 40, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [bob, float, size]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bob.value * -8 },
      { rotateZ: `${rotation}deg` },
    ],
  }));

  const ink = isLightColor(color) ? DARK_INK : LIGHT_INK;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: variant === 'dot' ? size / 2 : size * 0.28,
          backgroundColor: color,
        },
        style,
        animatedStyle,
      ]}
    >
      {variant === 'die' && (
        <>
          <View style={[styles.pip, dieDotStyle(size, 0.28, 0.28), { backgroundColor: hexToRgba(ink, 0.9) }]} />
          <View style={[styles.pip, dieDotStyle(size, 0.72, 0.72), { backgroundColor: hexToRgba(ink, 0.9) }]} />
        </>
      )}
      {variant === 'star' && <Text style={[styles.glyph, { fontSize: size * 0.55, color: ink }]}>★</Text>}
      {variant === 'chip' && (
        <Text style={[styles.label, { fontSize: size * 0.48, color: ink }]}>{label}</Text>
      )}
    </Animated.View>
  );
}

function dieDotStyle(size: number, x: number, y: number) {
  const pipSize = size * 0.18;
  return {
    width: pipSize,
    height: pipSize,
    borderRadius: pipSize / 2,
    left: size * x - pipSize / 2,
    top: size * y - pipSize / 2,
  };
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  pip: {
    position: 'absolute',
  },
  glyph: {},
  label: {},
});
