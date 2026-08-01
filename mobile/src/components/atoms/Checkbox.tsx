import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Check, Minus } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type CheckboxProps = {
  checked: boolean;
  indeterminate?: boolean;
  onPress: () => void;
  label?: string;
};

/** Checkbox: riempimento a gradiente secondary→secondaryGradient con transizione 150ms.
 *  `indeterminate` è uno stato reale e indipendente da `checked`, con glifo dedicato. */
export function Checkbox({ checked, indeterminate = false, onPress, label }: CheckboxProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  // Il riempimento è attivo sia da checked sia da indeterminate
  const isFilled = checked || indeterminate;
  const progress = useSharedValue(isFilled ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isFilled ? 1 : 0, { duration: 150 });
  }, [isFilled, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.5 + progress.value * 0.5 }],
  }));

  return (
    <Pressable onPress={onPress} style={styles.item} hitSlop={4}>
      <View style={[styles.box, { borderColor: colors.border }]}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.fill, fillStyle]}>
          <LinearGradient
            colors={[colors.secondary, colors.secondaryGradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, styles.fill]}
          >
            {indeterminate ? (
              <Minus size={14} color={colors.textColor} strokeWidth={3} />
            ) : (
              <Check size={14} color={colors.textColor} strokeWidth={3} />
            )}
          </LinearGradient>
        </Animated.View>
      </View>
      {label ? <Text style={[styles.label, { color: colors.textColor }]}>{label}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fill: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
  },
});
