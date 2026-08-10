import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type RatingStarProps = {
  active: boolean;
  color: string;
  inactiveColor: string;
  onPress: () => void;
};

const SIZE = 32;

/** Singola stella di rating: al cambio di `active` anima solo il riempimento (clip della larghezza), nessun effetto di scala.
 *  Un driver esterno che aggiorna le stelle in modo scaglionato ottiene così una cascata naturale, senza logica di delay qui. */
export function RatingStar({ active, color, inactiveColor, onPress }: RatingStarProps) {
  const progress = useSharedValue(active ? 1 : 0);

  // Solo riempimento fluido al cambio di stato
  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 250, easing: Easing.out(Easing.quad) });
  }, [active, progress]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <View style={styles.star}>
        <Text style={[styles.glyphBase, { color: inactiveColor }]}>★</Text>
        <Animated.View style={[styles.fill, fillStyle]}>
          <Text style={[styles.glyphFill, { color }]}>★</Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  star: {
    width: SIZE,
    height: SIZE,
  },
  glyphBase: {
    position: 'absolute',
    fontSize: SIZE,
    lineHeight: SIZE,
  },
  fill: {
    position: 'absolute',
    overflow: 'hidden',
    height: SIZE,
  },
  glyphFill: {
    fontSize: SIZE,
    lineHeight: SIZE,
  },
});
