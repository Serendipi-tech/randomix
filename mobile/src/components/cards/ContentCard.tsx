import type { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { CardShell } from '@/components/cards/CardShell';

type ContentVariant = 'outlined' | 'filled';

type ContentCardProps = {
  title: string;
  description?: string;
  variant: ContentVariant;
  icon?: ComponentType<{ size?: number; color?: string }>;
  onPress?: () => void;
};

/** Card di contenuto: `outlined` (bordo su sfondo foreground) o `filled` (sfondo pieno, senza bordo).
 *  Le due varianti differiscono solo nel trattamento dello sfondo, la struttura interna è identica.
 *  Con `icon` mostra un badge circolare a sinistra; con `onPress` la card è cliccabile e mostra la freccia. */
export function ContentCard({ title, description, variant, icon: Icon, onPress }: ContentCardProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const isFilled = variant === 'filled';

  return (
    <CardShell
      backgroundColor={isFilled ? colors.secondary : colors.foreground}
      borderColor={isFilled ? colors.secondary : colors.border}
      borderWidth={isFilled ? 0 : 1}
      onPress={onPress}
    >
      <View style={styles.row}>
        {Icon && (
          <View style={[styles.iconWrap, { backgroundColor: hexToRgba(colors.textColor, 0.15) }]}>
            <Icon size={22} color={colors.textColor} />
          </View>
        )}
        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: colors.textColor }]}>{title}</Text>
          {description && <Text style={[styles.description, { color: colors.textColor }]}>{description}</Text>}
        </View>
        {onPress && (
          <View style={[styles.arrow, { backgroundColor: hexToRgba(colors.textColor, 0.15) }]}>
            <ChevronRight size={18} color={colors.textColor} />
          </View>
        )}
      </View>
    </CardShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
  },
  arrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
