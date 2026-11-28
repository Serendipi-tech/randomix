import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
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

const TRACK_PADDING = 2;
const ITEM_GAP = 3;
const SLIDE_DURATION = 180;

/** Controllo a segmenti dumb: le opzioni (valore/label/colore attivo) arrivano dall'esterno, nessuna
 *  logica interna. Il segmento attivo è un thumb che scorre fra le posizioni invece di accendersi. */
export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const [trackWidth, setTrackWidth] = useState(0);
  const activeIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0,
  );
  const itemWidth =
    trackWidth > 0
      ? (trackWidth - TRACK_PADDING * 2 - ITEM_GAP * (options.length - 1)) / options.length
      : 0;

  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withTiming(activeIndex * (itemWidth + ITEM_GAP), { duration: SLIDE_DURATION });
  }, [activeIndex, itemWidth, offset]);

  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));

  const activeColor = options[activeIndex]?.activeColor ?? colors.textColor;

  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width)}
      style={[styles.container, { backgroundColor: hexToRgba(colors.primary, 0.18) }]}
    >
      {/* Thumb scorrevole dietro le etichette: una sola vista animata invece di N sfondi accesi/spenti */}
      {itemWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.thumb,
            thumbStyle,
            {
              width: itemWidth,
              backgroundColor: hexToRgba(activeColor, 0.3),
            },
          ]}
        />
      )}
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <Pressable key={option.value} onPress={() => onChange(option.value)} style={styles.item}>
            <Text style={[styles.label, !isActive && styles.labelIdle, { color: colors.textColor }]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Traccia senza bordo: l'unico contorno è quello del thumb, che vi scorre dentro
  container: {
    flexDirection: 'row',
    borderRadius: 11,
    padding: TRACK_PADDING,
    gap: ITEM_GAP,
  },
  thumb: {
    position: 'absolute',
    left: TRACK_PADDING,
    top: TRACK_PADDING,
    bottom: TRACK_PADDING,
    borderRadius: 9,
  },
  item: {
    flex: 1,
    minHeight: 26,
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Peso identico in ogni stato: cambiandolo la larghezza del testo salta mentre il thumb
  // scorre, e il segmento sembra sfarfallare. La selezione si legge dal thumb e dall'opacità.
  // Il discendente della riga è spazio vuoto che conta nel centraggio: senza questo compenso le
  // parole risultano più in basso del centro del blocco (stesso accorgimento del banner premium).
  label: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 3,
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  labelIdle: {
    opacity: 0.6,
  },
});
