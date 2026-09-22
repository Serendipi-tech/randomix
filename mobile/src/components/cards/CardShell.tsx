import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

type CardShellVariant = 'default' | 'callout' | 'gradient';

const SHELL_RADIUS = 12;

type CardShellProps = {
  children: ReactNode;
  borderColor?: string;
  backgroundColor?: string;
  borderWidth?: number;
  /** `callout`: solo barra accento a sinistra + sfondo tinta derivato da `borderColor`.
   *  `gradient`: bordo sottile a gradiente (non un fill) attorno a un interno a colore piatto normale,
   *  vedi `gradientColors`/`gradientBorderWidth`. */
  variant?: CardShellVariant;
  onPress?: () => void;
  /** Solo per variant `gradient`: coppia di colori del bordo, entrambi opachi (mai un alpha basso: da
   *  stop di gradiente, non da overlay, lascerebbe intravedere lo sfondo dietro la card).
   *  Default: lo stesso gradiente "filled" confermato in colors-showcase (secondary→secondaryGradient). */
  gradientColors?: readonly [string, string];
  /** Solo per variant `gradient`: spessore dell'anello colorato. Default 1.5. */
  gradientBorderWidth?: number;
};

/** Guscio visivo condiviso da tutte le varianti di Card: bordo, raggio, background e clipping.
 *  Con `onPress` l'intera area diventa cliccabile. */
export function CardShell({
  children,
  borderColor,
  backgroundColor,
  borderWidth,
  variant = 'default',
  onPress,
  gradientColors,
  gradientBorderWidth,
}: CardShellProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const accent = borderColor ?? colors.border;

  if (variant === 'gradient') {
    const fill = gradientColors ?? ([colors.secondary, colors.secondaryGradient] as const);
    const ringWidth = gradientBorderWidth ?? 1.5;
    const innerRadius = Math.max(0, SHELL_RADIUS - ringWidth);

    const gradientContent = (
      <LinearGradient
        colors={fill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientRing, { padding: ringWidth }]}
      >
        <View style={[styles.gradientInner, { backgroundColor: backgroundColor ?? colors.foreground, borderRadius: innerRadius }]}>
          {children}
        </View>
      </LinearGradient>
    );

    if (onPress) {
      return (
        <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
          {gradientContent}
        </Pressable>
      );
    }
    return gradientContent;
  }

  const shellStyle: ViewStyle =
    variant === 'callout'
      ? {
          backgroundColor: backgroundColor ?? hexToRgba(accent, 0.12),
          borderColor: accent,
          borderWidth: 0,
          borderLeftWidth: 3,
        }
      : {
          backgroundColor: backgroundColor ?? colors.foreground,
          borderColor: accent,
          ...(borderWidth !== undefined ? { borderWidth } : null),
        };

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.shell, shellStyle, { opacity: pressed ? 0.85 : 1 }]}>
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.shell, shellStyle]}>{children}</View>;
}

const styles = StyleSheet.create({
  shell: {
    padding: 16,
    borderRadius: SHELL_RADIUS,
    borderWidth: 1,
    overflow: 'hidden',
  },
  gradientRing: {
    borderRadius: SHELL_RADIUS,
    overflow: 'hidden',
  },
  gradientInner: {
    padding: 16,
    overflow: 'hidden',
  },
});
