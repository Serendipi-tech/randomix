import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Pencil, Tag as TagIcon, X } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { hexToRgba } from '@/utils/color';

type TagProps = {
  name: string;
  color: string;
  compact?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
};

/** Tag/etichetta con icona: sfondo tinto dal colore passato, testo dal tema. La variante compatta è uppercase. */
export function Tag({ name, color, compact = false, onEdit, onRemove }: TagProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <View
      style={[
        styles.container,
        {
          gap: compact ? 4 : 6,
          paddingVertical: compact ? 3 : 5,
          paddingHorizontal: compact ? 7 : 10,
          backgroundColor: hexToRgba(color, 0.15),
        },
      ]}
    >
      <TagIcon size={compact ? 11 : 14} color={color} strokeWidth={2.5} />
      <Text
        style={[
          styles.label,
          {
            color: colors.textColor,
            fontSize: compact ? 11 : 14,
            textTransform: compact ? 'uppercase' : 'none',
            letterSpacing: compact ? 0.3 : 0,
          },
        ]}
      >
        {name}
      </Text>
      {onEdit && (
        <Pressable onPress={onEdit} hitSlop={8}>
          <Pencil size={compact ? 11 : 13} color={colors.textColor} strokeWidth={2.5} />
        </Pressable>
      )}
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={8}>
          <X size={compact ? 11 : 13} color={colors.textColor} strokeWidth={2.5} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
  },
  label: {
    fontWeight: '600',
  },
});
