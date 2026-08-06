import { useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { BottomSheet } from '@/components/organisms/BottomSheet';

type ColorPickerSheetProps = {
  visible: boolean;
  onClose: () => void;
  colors: string[];
  selected: string;
  onSelect: (color: string) => void;
};

const GRID_GAP = 12;
const RECT_ASPECT_RATIO = 1.4; // largo x alto: rettangolo, non quadrato
const MIN_SLOT_HEIGHT = 48; // target touch minimo (Material/iOS ~44-48pt): mai sotto questo valore
const MIN_SLOT_WIDTH = MIN_SLOT_HEIGHT * RECT_ASPECT_RATIO;

/** Bottomsheet di scelta colore: griglia di rettangoli arrotondati (non pallini) pieni del colore
 *  stesso, che riempie tutta la larghezza disponibile. Selezione indicata abbassando l'opacità di
 *  tutti i rettangoli NON scelti (quello scelto resta a piena intensità, unico a risaltare) — niente
 *  bordi o icone sopra il colore. Colonne calcolate dalla larghezza misurata in modo che ogni
 *  rettangolo resti sempre sopra la dimensione minima di un target touch mobile. */
export function ColorPickerSheet({ visible, onClose, colors, selected, onSelect }: ColorPickerSheetProps) {
  const [gridWidth, setGridWidth] = useState(0);

  const handleGridLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (Math.abs(width - gridWidth) > 1) setGridWidth(width);
  };

  const columns = gridWidth > 0 ? Math.max(2, Math.floor((gridWidth + GRID_GAP) / (MIN_SLOT_WIDTH + GRID_GAP))) : 4;
  const slotWidth = gridWidth > 0 ? (gridWidth - (columns - 1) * GRID_GAP) / columns : MIN_SLOT_WIDTH;
  const slotHeight = slotWidth / RECT_ASPECT_RATIO;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.grid} onLayout={handleGridLayout}>
        {colors.map((color) => {
          const isSelected = selected === color;
          return (
            <Pressable
              key={color}
              onPress={() => {
                onSelect(color);
                onClose();
              }}
              style={[
                styles.swatch,
                { width: slotWidth, height: slotHeight, backgroundColor: color },
                !isSelected && styles.dimmed,
              ]}
            />
          );
        })}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    gap: GRID_GAP,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  swatch: {
    borderRadius: 14,
  },
  dimmed: {
    opacity: 0.35,
  },
});
