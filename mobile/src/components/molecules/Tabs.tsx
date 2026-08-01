import { Platform, Pressable, StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type TabsProps = {
  items: string[];
  activeIndex: number;
  onChange: (index: number) => void;
};

/** Tabs orizzontali: indicatore underline primary sull'attivo, scale-on-press interno. */
export function Tabs({ items, activeIndex, onChange }: TabsProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      {items.map((item, idx) => (
        <Pressable
          key={idx}
          onPress={() => onChange(idx)}
          style={({ pressed }) => [
            styles.item,
            {
              borderBottomColor: activeIndex === idx ? colors.primary : 'transparent',
              // Transizione morbida del colore solo su web (nativo non la supporta via style)
              ...(Platform.OS === 'web' ? ({ transitionProperty: 'border-color', transitionDuration: '150ms' } as ViewStyle) : {}),
              ...(pressed ? { transform: [{ scale: 0.96 }] } : {}),
            },
          ]}
        >
          <Text
            style={[
              styles.label,
              {
                color: activeIndex === idx ? colors.primary : colors.textColor,
                ...(Platform.OS === 'web' ? ({ transitionProperty: 'color', transitionDuration: '150ms' } as TextStyle) : {}),
              },
            ]}
          >
            {item}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    gap: 0,
  },
  item: {
    minHeight: 48,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
