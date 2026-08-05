import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Modal, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
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

const PANEL_WIDTH = 220;
const SCREEN_MARGIN = 12;

/** Pannello flottante generico ancorato a un trigger, in un Modal trasparente: dipinge sempre sopra
 *  il resto (incl. eventuali navbar/overlay) e si chiude tappando ovunque fuori dal pannello stesso
 *  (comportamento standard di qualsiasi popover). Nessuna conoscenza del contenuto. */
export function Tooltip({ trigger, content, visible, onToggle }: TooltipProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = visible !== undefined;
  const open = isControlled ? visible : internalOpen;

  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const anchorRef = useRef<View>(null);
  const [anchorRect, setAnchorRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  useEffect(() => {
    setAnimating(true);
    if (open) {
      setMounted(true);
      // Misurata qui (non nel gestore di tap) così funziona anche quando il trigger è a sua volta
      // un Pressable (es. Button): in quel caso il tap viene intercettato da lui, non dal wrapper
      // sotto, e questo effect è l'unico punto che vede sempre in modo affidabile `open` diventare true.
      anchorRef.current?.measureInWindow((x, y, width, height) => setAnchorRect({ x, y, width, height }));
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: Platform.OS !== 'web' }).start(() => setAnimating(false));
    } else {
      Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: Platform.OS !== 'web' }).start(() => {
        setMounted(false);
        setAnimating(false);
      });
    }
  }, [open, fadeAnim]);

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onToggle?.(next);
  };

  const panelPosition = anchorRect
    ? {
        left: Math.min(Math.max(anchorRect.x + anchorRect.width - PANEL_WIDTH + 8, SCREEN_MARGIN), screenWidth - PANEL_WIDTH - SCREEN_MARGIN),
        bottom: screenHeight - anchorRect.y + 8,
      }
    : null;

  return (
    <View style={styles.anchor} ref={anchorRef}>
      <Pressable onPress={() => setOpen(!open)} hitSlop={12}>
        {trigger}
      </Pressable>

      {mounted && (
        <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={() => setOpen(false)}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          {panelPosition && (
            <Animated.View
              pointerEvents={open ? 'auto' : 'none'}
              style={[
                styles.panel,
                panelPosition,
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
        </Modal>
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
    width: PANEL_WIDTH,
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
