import { StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { CardShell } from '@/components/cards/CardShell';

type ContentVariant = 'outlined' | 'filled';

type ContentCardProps = {
  title: string;
  description?: string;
  variant: ContentVariant;
};

/** Card di contenuto: `outlined` (bordo su sfondo foreground) o `filled` (sfondo pieno, senza bordo).
 *  Le due varianti differiscono solo nel trattamento dello sfondo, la struttura interna è identica. */
export function ContentCard({ title, description, variant }: ContentCardProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const isFilled = variant === 'filled';

  return (
    <CardShell
      backgroundColor={isFilled ? colors.secondary : colors.foreground}
      borderColor={isFilled ? colors.secondary : colors.border}
      borderWidth={isFilled ? 0 : 1}
    >
      <Text style={[styles.title, { color: colors.textColor }]}>{title}</Text>
      {description && <Text style={[styles.description, { color: colors.textColor }]}>{description}</Text>}
    </CardShell>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
  },
});
