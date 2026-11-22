import { StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type ColorResultsProps = {
  values: string[];
};

/** Riquadri colore (più grandi, 64px) con l'hex sotto in textColor: mai il token "disabled"
 *  per un testo che non è disabilitato, solo secondario. */
export function ColorResults({ values }: ColorResultsProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.wrap}>
      {values.map((value, i) => (
        <Animated.View key={`${value}-${i}`} entering={ZoomIn.delay(i * 60).springify().damping(14)} style={styles.item}>
          <View style={[styles.swatch, { backgroundColor: value }]} />
          <Text style={[styles.hex, { color: colors.textColor, opacity: 0.6 }]}>{value}</Text>
        </Animated.View>
      ))}
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
    width: 64,
    height: 64,
    borderRadius: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  hex: {
    fontSize: 12,
  },
});
