import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onChange: (page: number) => void;
};

/** Paginazione numerata: fondo primary sull'attiva. Il numero resta sempre textColor (voluto, non cambia sull'attiva). */
export function Pagination({ totalPages, currentPage, onChange }: PaginationProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <View style={styles.stack}>
      {pages.map((page) => (
        <Pressable
          key={page}
          onPress={() => onChange(page)}
          style={({ pressed }) => [
            styles.item,
            {
              backgroundColor: currentPage === page ? colors.primary : colors.foreground,
              borderColor: colors.border,
              // Transizione morbida solo su web (nativo non la supporta via style)
              ...(Platform.OS === 'web' ? ({ transitionProperty: 'background-color, border-color', transitionDuration: '150ms' } as ViewStyle) : {}),
              ...(pressed ? { transform: [{ scale: 0.94 }] } : {}),
            },
          ]}
        >
          <Text style={[styles.label, { color: colors.textColor }]}>{page}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  item: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontWeight: '600' },
});
