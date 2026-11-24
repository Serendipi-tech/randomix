import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type NumberResultsProps = {
  values: string[];
};

const ITEM_HEIGHT = 78;
const FILLER_DIGITS = 10;

/** Numeri come rullo di contachilometri: scorrono cifre casuali e si fermano sul valore vero. */
export function NumberResults({ values }: NumberResultsProps) {
  return (
    <View style={styles.wrap}>
      {values.map((value, i) => (
        <Reel key={`${value}-${i}`} value={value} delay={i * 80} />
      ))}
    </View>
  );
}

function Reel({ value, delay }: { value: string; delay: number }) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const translateY = useSharedValue(0);

  // cifre di riempimento dello scorrimento: generate una sola volta per rullo.
  // useState (non useMemo) per l'inizializzazione casuale: è l'unico hook con una lazy-init
  // garantita a singola esecuzione, quindi l'impurità di Math.random è confinata lì.
  const [fillers] = useState(() => Array.from({ length: FILLER_DIGITS }, () => Math.abs(Math.round(Math.random() * 9))));

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(-(FILLER_DIGITS * ITEM_HEIGHT), { duration: 950, easing: Easing.bezier(0.12, 0.75, 0.2, 1) }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sola animazione d'ingresso, nessun valore reattivo da risincronizzare
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={[styles.reel, { backgroundColor: colors.foreground, borderColor: colors.border }]}>
      <Animated.View style={animatedStyle}>
        {fillers.map((digit, i) => (
          <View key={i} style={styles.item}>
            <Text style={[styles.text, { color: colors.textColor }]}>{digit}</Text>
          </View>
        ))}
        <View style={styles.item}>
          <Text style={[styles.text, { color: colors.textColor }]}>{value}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    justifyContent: 'center',
  },
  reel: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 62,
    minWidth: 52,
    maxWidth: 84,
    height: ITEM_HEIGHT,
    borderRadius: 15,
    borderWidth: 1,
    overflow: 'hidden',
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: '700',
  },
});
