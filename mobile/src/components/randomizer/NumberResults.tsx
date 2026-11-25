import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type NumberResultsProps = {
  values: string[];
};

const BORDER_WIDTH = 1;
const FILLER_DIGITS = 10;
const SPIN_DURATION = 950;
const GAP = 7;
// Celle per riga: il lato si ricava dalla larghezza disponibile invece di essere fisso, così
// cinque numeri stanno in riga anche sugli schermi stretti
const PER_ROW = 5;
const MAX_CELL_SIZE = 62;

/** Numeri come rullo di contachilometri: scorrono cifre casuali e si fermano sul valore vero. */
export function NumberResults({ values }: NumberResultsProps) {
  const [rowWidth, setRowWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => setRowWidth(e.nativeEvent.layout.width);

  const cellSize = rowWidth
    ? Math.min(MAX_CELL_SIZE, Math.floor((rowWidth - GAP * (PER_ROW - 1)) / PER_ROW))
    : 0;

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      {cellSize > 0 &&
        values.map((value, i) => (
          <Reel key={`${value}-${i}`} value={value} delay={i * SPIN_DURATION} size={cellSize} />
        ))}
    </View>
  );
}

function Reel({ value, delay, size }: { value: string; delay: number; size: number }) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const translateY = useSharedValue(0);

  // In RN il box è border-box: lo spazio interno visibile è il lato meno i bordi, ed è quella
  // l'altezza di ogni cifra del rullo, altrimenti il valore finale resta fuori asse.
  const itemHeight = size - BORDER_WIDTH * 2;
  const fontSize = Math.round(size * 0.42);

  // cifre di riempimento dello scorrimento: generate una sola volta per rullo.
  // useState (non useMemo) per l'inizializzazione casuale: è l'unico hook con una lazy-init
  // garantita a singola esecuzione, quindi l'impurità di Math.random è confinata lì.
  const [fillers] = useState(() => Array.from({ length: FILLER_DIGITS }, () => Math.abs(Math.round(Math.random() * 9))));

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      // +1: la striscia parte dallo zero, quindi c'è una cella in più prima dei riempitivi
      withTiming(-((FILLER_DIGITS + 1) * itemHeight), {
        duration: SPIN_DURATION,
        easing: Easing.bezier(0.12, 0.75, 0.2, 1),
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sola animazione d'ingresso, nessun valore reattivo da risincronizzare
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const itemStyle = [styles.item, { height: itemHeight }];
  const textStyle = [styles.text, { color: colors.textColor, fontSize, lineHeight: fontSize }];

  return (
    <View
      style={[
        styles.reel,
        { width: size, height: size, backgroundColor: colors.foreground, borderColor: colors.border },
      ]}
    >
      <Animated.View style={animatedStyle}>
        {/* Prima dello scorrimento ogni cella mostra 0: tutti i rulli partono dallo stesso punto */}
        <View style={itemStyle}>
          <Text style={textStyle}>0</Text>
        </View>
        {fillers.map((digit, i) => (
          <View key={i} style={itemStyle}>
            <Text style={textStyle}>{digit}</Text>
          </View>
        ))}
        <View style={itemStyle}>
          <Text style={textStyle}>{value}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  // Quadrata: stessa misura in larghezza e altezza, angoli smussati
  reel: {
    borderRadius: 16,
    borderWidth: BORDER_WIDTH,
    overflow: 'hidden',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // includeFontPadding: su Android il padding della metrica non è simmetrico e scentra la cifra
  text: {
    fontWeight: '700',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
