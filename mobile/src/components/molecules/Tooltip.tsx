import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Platform, Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

type TooltipProps = {
  /** Elemento/icona che apre il pannello al tap. */
  trigger: ReactNode;
  /** Contenuto del pannello flottante (agnostico: password-strength o altro). */
  content: ReactNode;
  /** Controllo esterno opzionale; se assente lo stato è auto-gestito internamente. */
  visible?: boolean;
  onToggle?: (visible: boolean) => void;
};

/** Pannello flottante generico ancorato a un trigger. Animazione fade/scale e posizionamento interni,
 *  nessuna conoscenza del contenuto. */
export function Tooltip({ trigger, content, visible, onToggle }: TooltipProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = visible !== undefined;
  const open = isControlled ? visible : internalOpen;

  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setAnimating(true);
    if (open) {
      setMounted(true);
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: Platform.OS !== 'web' }).start(() => setAnimating(false));
    } else {
      Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: Platform.OS !== 'web' }).start(() => {
        setMounted(false);
        setAnimating(false);
      });
    }
  }, [open, fadeAnim]);

  const toggle = () => {
    const next = !open;
    if (!isControlled) setInternalOpen(next);
    onToggle?.(next);
  };

  return (
    <View style={styles.anchor}>
      <Pressable onPress={toggle} hitSlop={12}>
        {trigger}
      </Pressable>

      {mounted && (
        <Animated.View
          pointerEvents={open ? 'auto' : 'none'}
          style={[
            styles.panel,
            {
              borderColor: hexToRgba(colors.border, 0.5),
              boxShadow: `0px 8px 20px ${hexToRgba(colors.shadow, 0.35)}`,
              opacity: fadeAnim,
            },
            animating
              ? {
                  transform: [
                    { scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
                    { translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) },
                  ],
                }
              : null,
          ]}
        >
          <BlurView intensity={100} tint={colorScheme === 'dark' ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: hexToRgba(colors.foreground, 0.6) }]} />
          <View style={styles.content}>{content}</View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    justifyContent: 'center',
  },
  panel: {
    position: 'absolute',
    right: -8,
    bottom: 28,
    width: 220,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    zIndex: 20,
    elevation: 8,
  },
  content: {
    padding: 14,
    gap: 8,
  },
});
