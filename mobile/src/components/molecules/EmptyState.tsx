import { StyleSheet, Text, View } from 'react-native';
import { Colors, DisplayFonts, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { Button } from '@/components/atoms/Button';

type EmptyStateProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** Placeholder per elenchi vuoti: titolo e spiegazione centrati, con una CTA opzionale in fondo.
 *  Puro render da props. */
export function EmptyState({ title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textColor }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: colors.disabled }]}>{subtitle}</Text>}

      {actionLabel && onAction && (
        <View style={styles.action}>
          <Button variant="secondary" label={actionLabel} onPress={onAction} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    lineHeight: 21,
    textAlign: 'center',
    fontFamily: DisplayFonts.semiBold,
  },
  subtitle: {
    marginTop: Spacing.one,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  action: {
    marginTop: Spacing.three,
    alignSelf: 'stretch',
  },
});
