import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type CardShellProps = {
  children: ReactNode;
  borderColor?: string;
  backgroundColor?: string;
  borderWidth?: number;
  onPress?: () => void;
};

/** Guscio visivo condiviso da tutte le varianti di Card: bordo, raggio, background e clipping.
 *  Puro contenitore, nessuna logica di variante. Con `onPress` l'intera area diventa cliccabile. */
export function CardShell({ children, borderColor, backgroundColor, borderWidth, onPress }: CardShellProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const shellStyle = {
    backgroundColor: backgroundColor ?? colors.foreground,
    borderColor: borderColor ?? colors.border,
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
