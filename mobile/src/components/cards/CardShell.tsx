import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

type CardShellVariant = 'default' | 'callout';

type CardShellProps = {
  children: ReactNode;
  borderColor?: string;
  backgroundColor?: string;
  borderWidth?: number;
  /** `callout`: solo barra accento a sinistra + sfondo tinta derivato da `borderColor`. */
  variant?: CardShellVariant;
  onPress?: () => void;
};

/** Guscio visivo condiviso da tutte le varianti di Card: bordo, raggio, background e clipping.
 *  Con `onPress` l'intera area diventa cliccabile. */
export function CardShell({ children, borderColor, backgroundColor, borderWidth, variant = 'default', onPress }: CardShellProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const accent = borderColor ?? colors.border;
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
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
