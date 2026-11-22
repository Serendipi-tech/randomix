import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type StepperProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  step?: number;
};

/** Controllo numerico a incremento/decremento, con i limiti decisi dal chiamante. */
export function Stepper({ value, min, max, onChange, step = 1 }: StepperProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const decrease = () => onChange(Math.max(min, value - step));
  const increase = () => onChange(Math.min(max, value + step));

  return (
    <View style={styles.row}>
      <Pressable
        onPress={decrease}
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
