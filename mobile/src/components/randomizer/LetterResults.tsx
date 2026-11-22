import { StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';

type LetterResultsProps = {
  values: string[];
};

const ACCENT_CYCLE = [Colors.light.accent, Colors.light.secondary, Colors.light.warning, Colors.light.success, Colors.light.primary];

/** Tessere lettera con colore a rotazione e comparsa a cascata (stessa identità delle pillole numeriche). */
export function LetterResults({ values }: LetterResultsProps) {
  return (
    <View style={styles.wrap}>
      {values.map((value, i) => (
        <Animated.View key={`${value}-${i}`} entering={ZoomIn.delay(i * 70).springify().damping(14)}>
          <View style={[styles.tile, { backgroundColor: ACCENT_CYCLE[i % ACCENT_CYCLE.length] }]}>
            <Text style={styles.text}>{value}</Text>
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  tile: {
    width: 56,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.light.border,
  },
});
