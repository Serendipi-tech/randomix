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

/** Placeholder per liste vuote: bordo tratteggiato, badge icona tinto `primary`.
 *  La CTA opzionale (actionLabel + onAction) renderizza un Button primary a tutta larghezza. */
export function EmptyState({ icon: Icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { borderColor: hexToRgba(colors.border, 0.5) }]}>
      <View style={[styles.iconBadge, { backgroundColor: hexToRgba(colors.primary, 0.12) }]}>
        <Icon size={24} color={colors.primary} />
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
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.65,
  },
  action: {
    marginTop: 18,
    alignSelf: 'stretch',
  },
});
