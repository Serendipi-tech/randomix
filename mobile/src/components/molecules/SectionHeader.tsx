import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Colors, DisplayFonts, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type SectionHeaderProps = {
  title: string;
  /** Azione secondaria a destra: compare solo se arrivano sia etichetta sia handler. */
  actionLabel?: string;
  onActionPress?: () => void;
};

const ACTION_ICON_SIZE = 16;

/** Intestazione di sezione: titolo a sinistra e, opzionale, un'azione secondaria testuale a destra. */
export function SectionHeader({ title, actionLabel, onActionPress }: SectionHeaderProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: colors.textColor }]} numberOfLines={1}>
        {title}
      </Text>
      {actionLabel && onActionPress && (
        <Pressable
          onPress={onActionPress}
          hitSlop={10}
          style={({ pressed }) => [styles.action, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={[styles.actionLabel, { color: colors.secondaryGradient }]}>{actionLabel}</Text>
          <ChevronRight size={ACTION_ICON_SIZE} color={colors.secondaryGradient} strokeWidth={2.5} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  title: {
    flexShrink: 1,
    fontSize: 20,
    lineHeight: 24,
    fontFamily: DisplayFonts.semiBold,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
  },
  actionLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
  },
});
