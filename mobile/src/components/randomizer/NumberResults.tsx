import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';

type NumberResultsProps = {
  values: string[];
};

// palette "adesivo" fissa (non segue dark/light): stessa scelta decorativa già usata per questi risultati
const ACCENT_CYCLE = [Colors.light.accent, Colors.light.secondary, Colors.light.warning, Colors.light.success, Colors.light.primary];

/** Pillole numeriche con colore a rotazione e comparsa a cascata. */
export function NumberResults({ values }: NumberResultsProps) {
  return (
    <View style={styles.wrap}>
      {values.map((value, i) => (
        <Animated.View key={`${value}-${i}`} entering={FadeInUp.delay(i * 60).springify().damping(14)}>
          <View style={[styles.chip, { backgroundColor: ACCENT_CYCLE[i % ACCENT_CYCLE.length] }]}>
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
  chip: {
    minWidth: 62,
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
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
