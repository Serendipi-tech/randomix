import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { useRepeatPress } from '@/utils/useRepeatPress';

type StepperProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  step?: number;
};

/** Controllo numerico a incremento/decremento, con i limiti decisi dal chiamante.
 *  Tenendo premuto avanza da solo, e dopo un po' a gruppi (vedi `useRepeatPress`). */
export function Stepper({ value, min, max, onChange, step = 1 }: StepperProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const decrease = () => onChange(Math.max(min, value - step));
  const increase = () => onChange(Math.min(max, value + step));

  const repeatDecrease = useRepeatPress((multiplier) => {
    if (value <= min) return false;
    onChange(Math.max(min, value - step * multiplier));
  });
  const repeatIncrease = useRepeatPress((multiplier) => {
    if (value >= max) return false;
    onChange(Math.min(max, value + step * multiplier));
  });

  return (
    <View style={styles.row}>
      <Pressable
        onPress={decrease}
        onPressIn={repeatDecrease.start}
        onPressOut={repeatDecrease.stop}
        disabled={value <= min}
        style={({ pressed }) => [
          styles.btn,
          { borderColor: colors.border, backgroundColor: colors.foreground, opacity: value <= min ? 0.4 : 1 },
          pressed ? styles.pressed : null,
        ]}
      >
        <Minus size={16} color={colors.textColor} />
      </Pressable>
      <Text style={[styles.value, { color: colors.textColor }]}>{value}</Text>
      <Pressable
        onPress={increase}
        onPressIn={repeatIncrease.start}
        onPressOut={repeatIncrease.stop}
        disabled={value >= max}
        style={({ pressed }) => [
          styles.btn,
          { borderColor: colors.border, backgroundColor: colors.foreground, opacity: value >= max ? 0.4 : 1 },
          pressed ? styles.pressed : null,
        ]}
      >
        <Plus size={16} color={colors.textColor} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ scale: 0.9 }],
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 36,
    textAlign: 'center',
  },
});
