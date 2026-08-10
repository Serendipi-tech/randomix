import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  /** Colore dello stato attivo (tinta sfondo + testo); se assente usa il colore del testo. */
  activeColor?: string;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** Controllo a segmenti dumb: le opzioni (valore/label/colore attivo) arrivano dall'esterno, nessuna logica interna. */
export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      {options.map((option, i) => {
        const isActive = option.value === value;
        const activeColor = option.activeColor ?? colors.textColor;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.item,
              i > 0 && { borderLeftWidth: 1, borderLeftColor: colors.border },
              isActive && { backgroundColor: hexToRgba(activeColor, 0.15) },
            ]}
          >
            <Text style={[styles.label, { color: isActive ? activeColor : colors.textColor }]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  item: {
    flex: 1,
    minHeight: 44,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
