import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type RatingStarProps = {
  active: boolean;
  color: string;
  inactiveColor: string;
  onPress: () => void;
};

const SIZE = 32;

/** Singola stella di rating: al cambio di `active` anima il riempimento (clip della larghezza) e un rimbalzo di scala.
 *  Un driver esterno che aggiorna le stelle in modo scaglionato ottiene così una cascata naturale, senza logica di delay qui. */
export function RatingStar({ active, color, inactiveColor, onPress }: RatingStarProps) {
  const progress = useSharedValue(active ? 1 : 0);
  const scale = useSharedValue(1);

  // Riempimento fluido + pop di scala a ogni cambio di stato
  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 250, easing: Easing.out(Easing.quad) });
    scale.value = withSequence(
      withTiming(active ? 1.3 : 0.85, { duration: 120, easing: Easing.out(Easing.quad) }),
      withSpring(1, { damping: 7, stiffness: 180 })
    );
  }, [active, progress, scale]);

  const containerStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Animated.View style={[styles.star, containerStyle]}>
        <Text style={[styles.glyphBase, { color: inactiveColor }]}>★</Text>
        <Animated.View style={[styles.fill, fillStyle]}>
          <Text style={[styles.glyphFill, { color }]}>★</Text>
        </Animated.View>
      </Animated.View>
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
  },
  fill: {
    position: 'absolute',
    overflow: 'hidden',
    height: SIZE + 8,
  },
  glyphFill: {
    fontSize: SIZE,
  },
});
