import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type ColorResultsProps = {
  values: string[];
};

const SWATCH_SIZE = 64;

/** Riquadri colore (64px) che si riempiono dal basso, con l'hex sotto in textColor attenuato
 *  (mai il token "disabled" per un testo che non è disabilitato, solo secondario). */
export function ColorResults({ values }: ColorResultsProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.wrap}>
      {values.map((value, i) => (
        <View key={`${value}-${i}`} style={styles.item}>
          <Swatch hex={value} delay={i * 80} />
          <Text style={[styles.hex, { color: colors.textColor, opacity: 0.55 }]}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

function Swatch({ hex, delay }: { hex: string; delay: number }) {
  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withDelay(delay, withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sola animazione d'ingresso, nessun valore reattivo da risincronizzare
  }, []);

  const fillStyle = useAnimatedStyle(() => ({
    height: fill.value * SWATCH_SIZE,
  }));

  return (
    <View style={styles.swatch}>
      <Animated.View style={[styles.fill, { backgroundColor: hex }, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  item: {
    alignItems: 'center',
    gap: 5,
  },
  swatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: 16,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  fill: {
    width: '100%',
  },
  hex: {
    fontSize: 11,
  },
});
