import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { Button } from '@/components/atoms/Button';

type EmptyStateProps = {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** Placeholder per liste vuote: nessuno sfondo, badge icona tinto `primary`.
 *  La CTA opzionale (actionLabel + onAction) renderizza un Button primary a tutta larghezza. */
export function EmptyState({ icon: Icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <View style={[styles.iconBadge, { backgroundColor: hexToRgba(colors.primary, 0.12) }]}>
        <Icon size={20} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.textColor }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: colors.textColor }]}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <View style={styles.action}>
          <Button variant="primary" label={actionLabel} onPress={onAction} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.65,
    textAlign: 'center',
  },
  action: {
    marginTop: 18,
    alignSelf: 'stretch',
  },
});
