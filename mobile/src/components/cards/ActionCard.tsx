import { StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { CardShell } from '@/components/cards/CardShell';
import { Button } from '@/components/atoms/Button';

type ActionCardProps = {
  title: string;
  description?: string;
  actionLabel: string;
  onAction: () => void;
};

/** Card con CTA: titolo, descrizione opzionale e un `Button` primario che invoca `onAction`. */
export function ActionCard({ title, description, actionLabel, onAction }: ActionCardProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <CardShell backgroundColor={colors.foreground} borderColor={colors.border}>
      <Text style={[styles.title, { color: colors.textColor }]}>{title}</Text>
      {description && <Text style={[styles.description, { color: colors.textColor }]}>{description}</Text>}
      <Button variant="primary" label={actionLabel} onPress={onAction} />
    </CardShell>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
});
