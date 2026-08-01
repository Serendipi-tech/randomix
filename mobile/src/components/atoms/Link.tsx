import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type LinkProps = {
  label: string;
  onPress: () => void;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
};

/** Link testuale accent con underline via bordo; feedback solo in opacità al press. */
export function Link({ label, onPress, icon: Icon }: LinkProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <Pressable onPress={onPress} hitSlop={12} style={styles.pressable}>
      {({ pressed }) => (
        <View style={[styles.underline, { borderBottomColor: colors.accent, opacity: pressed ? 0.5 : 1 }]}>
          {Icon ? <Icon size={16} color={colors.accent} /> : null}
          <Text style={[styles.label, { color: colors.accent }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    paddingVertical: 12,
  },
  underline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 1.5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
