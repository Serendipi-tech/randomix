import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Colors } from '@/constants/theme';

type RadialBackgroundProps = {
  colorScheme: 'light' | 'dark';
};

/** Sfondo dell'app come da design confermato (colors-showcase): tinta piena `background`
 *  + un glow radiale morbido in alto ricavato da `backgroundRadial`. */
export function RadialBackground({ colorScheme }: RadialBackgroundProps) {
  const colors = Colors[colorScheme];

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
      <Svg width="100%" height={450} viewBox="0 0 400 400" style={styles.glow}>
        <Defs>
          <RadialGradient id="appBgGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={colors.backgroundRadial} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={colors.backgroundRadial} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="200" cy="200" r="200" fill="url(#appBgGlow)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    top: -200,
    left: 0,
    right: 0,
  },
});
