import { Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { LIST_ICONS, type ListIconKey } from '@/constants/list-icons';

interface IconPickerRowProps {
  selected: ListIconKey;
  onSelect: (key: ListIconKey) => void;
  accentColor: string;
  colorScheme: 'light' | 'dark';
}

/** Riga di icone Lucide selezionabili come icona della lista, stesso pattern visivo di ColorPickerRow. */
export function IconPickerRow({ selected, onSelect, accentColor, colorScheme }: IconPickerRowProps) {
  const colors = Colors[colorScheme];

  return (
    <View style={styles.row}>
      {LIST_ICONS.map(({ key, icon: Icon }) => {
        const isSelected = selected === key;
        return (
          <Pressable
            key={key}
            onPress={() => onSelect(key)}
            style={[styles.ring, isSelected && { borderColor: accentColor }]}>
            <Icon size={20} color={isSelected ? accentColor : colors.textColor} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ring: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
