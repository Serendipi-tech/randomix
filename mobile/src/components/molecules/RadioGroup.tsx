import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type RadioOption = {
  label: string;
  value: string;
};

type RadioGroupProps = {
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
};

/** Gruppo di radio button a selezione singola. */
export function RadioGroup({ options, selectedValue, onChange }: RadioGroupProps) {
  return (
    <View style={styles.stack}>
      {options.map((option) => (
        <RadioItem
          key={option.value}
          option={option}
          selected={option.value === selectedValue}
          onPress={() => onChange(option.value)}
        />
      ))}
    </View>
  );
}

type RadioItemProps = {
  option: RadioOption;
  selected: boolean;
  onPress: () => void;
};

/** Singola opzione: bordo e pallino attivi condividono un'unica fonte di colore (primary). */
function RadioItem({ option, selected, onPress }: RadioItemProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, { duration: 150 });
  }, [selected, progress]);

  const innerStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.3 + progress.value * 0.7 }],
  }));

  return (
    <Pressable onPress={onPress} style={styles.item} hitSlop={4}>
      <View style={[styles.outer, { borderColor: selected ? colors.primary : colors.border }]}>
        <Animated.View style={[styles.inner, { backgroundColor: colors.primary }, innerStyle]} />
      </View>
      <Text style={[styles.label, { color: colors.textColor }]}>{option.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  outer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 14,
  },
});
