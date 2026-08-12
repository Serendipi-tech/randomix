import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, Extrapolation, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
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

// Trascinamento oltre questa soglia (o con velocità sufficiente) verso il basso chiude lo sheet
const CLOSE_DISTANCE = 90;
const CLOSE_VELOCITY = 800;

/** Shell generica per bottomsheet: backdrop + slide-in dal basso + handle bar trascinabile per chiudere.
 *  Content-agnostica, il contenuto è interamente a carico del chiamante via `children`. */
export function BottomSheet({ visible, onClose, children, height }: BottomSheetProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const { height: screenHeight } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);
  // Posizione verticale in px: 0 = aperto, screenHeight = chiuso (fuori schermo sotto). Un solo valore guida
  // slide-in/out, drag e fade del backdrop: nessuna coppia di animazioni che si combatte.
  const translateY = useSharedValue(screenHeight);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateY.value = withTiming(0, { duration: 260, easing: Easing.out(Easing.cubic) });
    } else {
      translateY.value = withTiming(screenHeight, { duration: 220, easing: Easing.in(Easing.cubic) }, (finished) => {
        if (finished) runOnJS(setMounted)(false);
      });
    }
  }, [visible, screenHeight]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, screenHeight], [1, 0], Extrapolation.CLAMP),
  }));
  // Slide via marginBottom (NON transform): su web il transform sfoca il testo a DPI frazionarie. translateY down = marginBottom più negativo = sheet giù.
  const sheetStyle = useAnimatedStyle(() => ({ marginBottom: -translateY.value }));

  // Drag sull'handle: segue il dito verso il basso; al rilascio chiude o torna su in base all'ULTIMO gesto (velocità)
  const dragGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      // Conta la DIREZIONE al rilascio: se ci si muove verso l'alto (velocità negativa, anche lenta) riapre sempre.
      // Chiude solo con flick veloce verso il basso, oppure se trascinata oltre soglia e NON in risalita.
      const shouldClose = e.velocityY > CLOSE_VELOCITY || (e.velocityY >= 0 && e.translationY > CLOSE_DISTANCE);
      if (shouldClose) {
        // Prosegue verso il basso fino a uscire (nessun rimbalzo): lo slide-out lo completa l'effetto su `visible`
        runOnJS(onClose)();
      } else {
        translateY.value = withTiming(0, { duration: 160, easing: Easing.out(Easing.cubic) });
      }
    });

  if (!mounted && !visible) return null;

  return (
    // Modal (non solo View assoluta) per dipingere sempre sopra la navbar flottante, che è un sibling
    // disegnato dopo il contenuto della schermata e altrimenti la coprirebbe.
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      {/* Necessario per far funzionare i gesti dentro il Modal (gerarchia di view separata) */}
      <GestureHandlerRootView style={styles.root}>
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
            <GestureDetector gesture={dragGesture}>
              <View style={styles.handleWrap}>
                <View style={[styles.handle, { backgroundColor: hexToRgba(colors.border, 0.6) }]} />
              </View>
            </GestureDetector>
            {children}
          </View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  anchor: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 0,
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // Nessun bordo inferiore: lo sheet è ancorato al fondo dello schermo
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    overflow: 'hidden',
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
});
