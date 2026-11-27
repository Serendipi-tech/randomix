import { useEffect, useState, type ReactNode } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Motion } from '@/constants/motion';

type CollapsibleProps = {
  collapsed: boolean;
  children: ReactNode;
};

/** Contenitore che si chiude in altezza: il contenuto resta montato e misurato, quello che si anima
 *  è l'altezza del riquadro che lo ritaglia. Nessuna dissolvenza: si chiude e basta. */
export function Collapsible({ collapsed, children }: CollapsibleProps) {
  // Altezza naturale del contenuto: il figlio non è vincolato, quindi onLayout la riporta anche
  // mentre il riquadro esterno è chiuso
  const [contentHeight, setContentHeight] = useState(0);
  const progress = useSharedValue(collapsed ? 0 : 1);

  useEffect(() => {
    progress.value = withTiming(collapsed ? 0 : 1, { duration: Motion.collapse });
  }, [collapsed, progress]);

  const animatedStyle = useAnimatedStyle(() => ({ height: contentHeight * progress.value }));

  return (
    <Animated.View style={[styles.clip, contentHeight > 0 && animatedStyle]}>
      <View onLayout={(e: LayoutChangeEvent) => setContentHeight(e.nativeEvent.layout.height)}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
});
