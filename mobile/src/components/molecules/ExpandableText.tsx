import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent, type StyleProp, type TextStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type ExpandableTextProps = {
  text: string;
  style?: StyleProp<TextStyle>;
  /** Numero di righe mostrate prima del troncamento (default 3). */
  numberOfLines?: number;
  /** Controllato dal genitore: il pulsante che espande/richiude vive nell'header della sezione (accanto
   *  al titolo/matita), non sovrapposto al testo — posizione fissa, non dipende da dove finisce l'ultima riga. */
  expanded: boolean;
  /** Notifica il genitore se il testo risulta troncato, per mostrare o meno il pulsante nell'header. */
  onTruncatedChange?: (truncated: boolean) => void;
};

const ANIMATION_DURATION = 220;

/** Testo troncato a `numberOfLines` righe, con transizione animata (altezza) fra troncato/espanso invece
 *  che uno scatto secco. Il testo è sempre reso per intero dentro un contenitore overflow:hidden la cui
 *  altezza anima fra due misure prese da copie invisibili (stessa larghezza del contenitore): una limitata
 *  a `numberOfLines`, l'altra senza limiti — stessa tecnica di misura usata per il titolo in ItemCardDetails. */
export function ExpandableText({ text, style, numberOfLines = 3, expanded, onTruncatedChange }: ExpandableTextProps) {
  const [width, setWidth] = useState(0);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [fullHeight, setFullHeight] = useState(0);
  const truncated = fullHeight > collapsedHeight + 2;
  const measured = collapsedHeight > 0 && fullHeight > 0;
  const height = useSharedValue(0);
  const initialized = useRef(false);

  useEffect(() => {
    onTruncatedChange?.(truncated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [truncated]);

  // Cambio testo (es. item diverso): azzera le misure, il genitore azzera `expanded`
  useEffect(() => {
    setCollapsedHeight(0);
    setFullHeight(0);
    initialized.current = false;
  }, [text]);

  // Anima verso l'altezza target quando cambia `expanded` (o appena le misure sono pronte, senza animare la prima volta)
  useEffect(() => {
    if (!measured) return;
    const target = expanded ? fullHeight : collapsedHeight;
    if (!initialized.current) {
      height.value = target;
      initialized.current = true;
    } else {
      height.value = withTiming(target, { duration: ANIMATION_DURATION });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, measured, fullHeight, collapsedHeight]);

  const animatedStyle = useAnimatedStyle(() => ({ height: height.value }));

  return (
    <View onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}>
      {/* Prima della misura: comportamento diretto (numberOfLines), niente flash di testo pieno non troncato */}
      <Animated.View style={[styles.clip, measured && animatedStyle]}>
        <Text style={style} numberOfLines={measured ? undefined : numberOfLines}>
          {text}
        </Text>
      </Animated.View>
      {width > 0 && (
        <>
          <Text
            style={[style, styles.measure, { width }]}
            numberOfLines={numberOfLines}
            onLayout={(e: LayoutChangeEvent) => setCollapsedHeight(e.nativeEvent.layout.height)}
          >
            {text}
          </Text>
          <Text
            style={[style, styles.measure, { width }]}
            onLayout={(e: LayoutChangeEvent) => setFullHeight(e.nativeEvent.layout.height)}
          >
            {text}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
  measure: {
    position: 'absolute',
    opacity: 0,
    left: -9999,
  },
});
