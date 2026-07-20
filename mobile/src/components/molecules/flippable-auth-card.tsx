import type { PropsWithChildren } from 'react';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import type { StyleProp, ViewStyle } from 'react-native';
import { Card } from './card';

type FlippableAuthCardProps = PropsWithChildren<{
  colorScheme: 'light' | 'dark';
  style: AnimatedStyle<StyleProp<ViewStyle>>;
  minHeight?: number;
}>;

/** Involucro animato della Card: applica la rotazione 3D del flip e mantiene l'altezza stabile tra le facce. */
export function FlippableAuthCard({ colorScheme, style, minHeight, children }: FlippableAuthCardProps) {
  return (
    <Animated.View style={style}>
      <Card colorScheme={colorScheme} style={minHeight ? { minHeight } : undefined}>
        {children}
      </Card>
    </Animated.View>
  );
}
