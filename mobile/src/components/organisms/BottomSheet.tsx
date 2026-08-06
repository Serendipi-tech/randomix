import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Altezza fissa del pannello (indipendente dal contenuto): utile quando il contenuto interno
   *  cambia dimensione (es. tab) e non deve far "saltare" la dimensione dello sheet. Se assente,
   *  l'altezza segue il contenuto fino a `maxHeight`. */
  height?: number;
};

/** Shell generica per bottomsheet: backdrop + slide-in dal basso + handle bar. Content-agnostica,
 *  il contenuto è interamente a carico del chiamante via `children`. */
export function BottomSheet({ visible, onClose, children, height }: BottomSheetProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const { height: screenHeight } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);
  // 0 = chiuso (fuori schermo), 1 = aperto: guida sia lo slide che il fade del backdrop.
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      progress.value = withTiming(1, { duration: 260, easing: Easing.out(Easing.cubic) });
    } else {
      progress.value = withTiming(0, { duration: 220, easing: Easing.in(Easing.cubic) }, (finished) => {
        if (finished) runOnJS(setMounted)(false);
      });
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  // Slide via marginBottom animato (NON transform): su web il transform promuove il layer a compositing
  // GPU e a DPI frazionarie (comune su Windows) sfoca il testo anche a riposo.
  const sheetStyle = useAnimatedStyle(() => ({ marginBottom: (progress.value - 1) * screenHeight }));

  if (!mounted && !visible) return null;

  return (
    // Modal (non solo View assoluta) per dipingere sempre sopra la navbar flottante, che è un sibling
    // disegnato dopo il contenuto della schermata e altrimenti la coprirebbe.
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={[StyleSheet.absoluteFill, Platform.OS === 'web' ? ({ cursor: 'default' } as object) : null]}
      >
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: hexToRgba(colors.shadow, 0.45) }, backdropStyle]} />
      </Pressable>
      <Animated.View style={[styles.anchor, sheetStyle]}>
        <View
          style={[
            styles.container,
            {
              height,
              maxHeight: screenHeight * 0.92,
              backgroundColor: colors.foreground,
              borderColor: colors.border,
              boxShadow: `0px -8px 24px ${hexToRgba(colors.shadow, 0.3)}`,
            },
          ]}
        >
          <View style={styles.handleWrap}>
            <View style={[styles.handle, { backgroundColor: hexToRgba(colors.border, 0.6) }]} />
          </View>
          {children}
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 0,
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
});
