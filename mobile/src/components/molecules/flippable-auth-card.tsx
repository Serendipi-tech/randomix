import type { PropsWithChildren } from 'react';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import type { StyleProp, ViewStyle } from 'react-native';
import { Card } from './card';

type FlippableAuthCardProps = PropsWithChildren<{
  colorScheme: 'light' | 'dark';
  style: AnimatedStyle<StyleProp<ViewStyle>>;
  height?: number;
}>;

/** Involucro animato della Card: applica la rotazione 3D del flip. Altezza fissa (non minima): la card
 *  non deve mai crescere o restringersi in base alla faccia mostrata, il contenuto in eccesso scrolla dentro. */
export function FlippableAuthCard({ colorScheme, style, height, children }: FlippableAuthCardProps) {
  return (
    <Animated.View style={style}>
      <Card colorScheme={colorScheme} style={height ? { height } : undefined}>
        {children}
      </Card>
    </Animated.View>
  );
}
