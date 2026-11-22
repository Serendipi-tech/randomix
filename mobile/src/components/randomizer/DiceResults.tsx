import { StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { DiceFace } from '@/components/randomizer/DiceFace';

type DiceResultsProps = {
  values: string[];
  faces: number;
  totalLabel: string;
};

/** Facce dei dadi (una forma per fascia di facce) più, se sono più di una, la somma. */
export function DiceResults({ values, faces, totalLabel }: DiceResultsProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const total = values.reduce((sum, v) => sum + Number(v), 0);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {values.map((value, i) => (
          <Animated.View key={`${value}-${i}`} entering={ZoomIn.delay(i * 70).springify().damping(13)}>
            <DiceFace value={Number(value)} faces={faces} />
          </Animated.View>
        ))}
      </View>
      {values.length > 1 && (
        <Text style={[styles.total, { color: colors.textColor, opacity: 0.6 }]}>
          {totalLabel}: {total}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  total: {
    fontSize: 15,
    textAlign: 'center',
  },
});
