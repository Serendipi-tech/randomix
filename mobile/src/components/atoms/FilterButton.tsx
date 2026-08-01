import { Pressable, StyleSheet } from 'react-native';
import { Filter } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { hexToRgba } from '@/utils/color';

type FilterButtonProps = {
  active: boolean;
  onPress: () => void;
};

/** Bottone-icona trigger dei filtri: bordo/fondo tinti primary quando attivo. */
export function FilterButton({ active, onPress }: FilterButtonProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          borderColor: active ? colors.primary : colors.border,
          backgroundColor: active ? hexToRgba(colors.primary, 0.12) : colors.foreground,
        },
      ]}
    >
      <Filter size={20} color={active ? colors.primary : colors.textColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
