import type { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacing } from '@/constants/theme';
import { TileCard } from '@/components/cards/TileCard';

export type ModeGridItem = {
  key: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  label: string;
  tint: string;
};

type ModeGridProps = {
  items: ModeGridItem[];
  onSelect: (key: string) => void;
};

/** Griglia a due colonne delle modalità del randomizzatore. Celle a larghezza fissa e riga
 *  centrata: l'ultima voce di una riga spaiata resta grande come le altre. */
export function ModeGrid({ items, onSelect }: ModeGridProps) {
  return (
    <View style={styles.grid}>
      {items.map(({ key, icon, label, tint }) => (
        <View key={key} style={styles.cell}>
          <TileCard icon={icon} label={label} color={tint} onPress={() => onSelect(key)} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  cell: {
    width: '47%',
  },
});
