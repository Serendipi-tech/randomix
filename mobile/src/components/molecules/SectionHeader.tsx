import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { Colors, DisplayFonts, Spacing } from '@/constants/theme';
import { Motion } from '@/constants/motion';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

type SectionHeaderProps = {
  title: string;
  /** Azione secondaria a destra: compare solo se arrivano sia etichetta sia handler. */
  actionLabel?: string;
  onActionPress?: () => void;
  /** Quantità di elementi nella sezione, in una pillola accanto al titolo. */
  count?: number;
  /** Con questo handler l'intestazione diventa un interruttore apri/chiudi: la freccia compare
   *  all'estrema destra, dove starebbe l'azione secondaria (le due non convivono). */
  onToggle?: () => void;
  /** Stato della sezione quando è richiudibile: ruota la freccia. */
  collapsed?: boolean;
};

const ACTION_ICON_SIZE = 16;

/** Intestazione di sezione: titolo a sinistra e, opzionale, un'azione secondaria testuale a destra. */
export function SectionHeader({
  title,
  actionLabel,
  onActionPress,
  count,
  onToggle,
  collapsed = false,
}: SectionHeaderProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  // La freccia ruota invece di saltare da uno stato all'altro: chiusa punta a sinistra
  const rotation = useDerivedValue(() => withTiming(collapsed ? 90 : 0, { duration: Motion.collapse }), [collapsed]);
  const chevronStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  const heading = (
    <View style={styles.heading}>
      <Text style={[styles.title, { color: colors.textColor }]} numberOfLines={1}>
        {title}
      </Text>
      {count !== undefined && (
        <View style={[styles.countPill, { backgroundColor: hexToRgba(colors.primary, 0.25) }]}>
          <Text style={[styles.countLabel, { color: colors.textColor }]}>{count}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.row}>
      {onToggle ? (
        <Pressable onPress={onToggle} hitSlop={8} style={styles.toggleRow}>
          {heading}
          <Animated.View style={chevronStyle}>
            <ChevronDown size={ACTION_ICON_SIZE + 4} color={colors.textColor} strokeWidth={2.5} />
          </Animated.View>
        </Pressable>
      ) : (
        heading
      )}
      {!onToggle && actionLabel && onActionPress && (
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
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  // L'interruttore occupa tutta la riga: titolo e conteggio a sinistra, freccia all'estrema destra
  toggleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  countPill: {
    minWidth: 22,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countLabel: {
    fontSize: 12,
    fontWeight: '700',
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
