import { useState } from 'react';
import { Tooltip } from '@/components/molecules/Tooltip';
import { ColorPickerRow } from '@/components/atoms/color-picker-row';
import { Button } from '@/components/atoms/Button';

type ColorPickerTooltipProps = {
  colors: string[];
  selected: string;
  onSelect: (color: string) => void;
  colorScheme: 'light' | 'dark';
  label: string;
};

/** Trigger = Button variant "soft" con quadretto del colore corrente; al tap apre la griglia colori
 *  dentro il Tooltip generico, si richiude automaticamente dopo la scelta. */
export function ColorPickerTooltip({ colors, selected, onSelect, colorScheme, label }: ColorPickerTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip
      visible={open}
      onToggle={setOpen}
      trigger={<Button variant="soft" swatchColor={selected} label={label} onPress={() => setOpen(true)} />}
      content={
        <ColorPickerRow
          colors={colors}
          selected={selected}
          onSelect={(color) => {
            onSelect(color);
            setOpen(false);
          }}
          colorScheme={colorScheme}
        />
      }
    />
  );
}
