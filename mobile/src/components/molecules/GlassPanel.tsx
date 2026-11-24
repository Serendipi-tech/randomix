import { BlurView } from 'expo-blur';
import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Colors, GradientBackground } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

type GlassPanelProps = PropsWithChildren<{
  /** Tinge bordo e bagliore del pannello; default al bordo neutro del tema. */
  accentColor?: string;
  style?: ViewStyle;
}>;

/** Pannello di vetro generico (blur + tinta + bordo + bagliore), a differenza di `Card` non forza
 *  altezza fissa né scroll interno: si dimensiona sul contenuto. Stessa ricetta glassmorphism, per
 *  contenuti che non sono una "faccia" di autenticazione. */
export function GlassPanel({ accentColor, style, children }: GlassPanelProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const accent = accentColor ?? colors.border;

  const fill = colorScheme === 'light' ? hexToRgba(colors.primary, 0.12) : hexToRgba(GradientBackground.dark.stops[1], 0.45);

  return (
    <View style={[styles.shadowWrapper, { boxShadow: `0px 16px 32px ${hexToRgba(accent, 0.3)}` }, style]}>
      <View style={[styles.clip, { borderColor: hexToRgba(accent, 0.5) }]}>
        <BlurView intensity={50} tint="default" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: fill }]} />
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: 28,
    elevation: 12,
  },
  clip: {
    borderRadius: 28,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    padding: 24,
    gap: 20,
    alignItems: 'center',
  },
});
