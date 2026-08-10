import { StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type SectionLabelProps = {
  children: string;
};

/** Label uppercase secondaria (filtri, sezioni della bottomsheet di dettaglio): puro wrapper di stile. */
export function SectionLabel({ children }: SectionLabelProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return <Text style={[styles.label, { color: colors.textColor }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    opacity: 0.55,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
