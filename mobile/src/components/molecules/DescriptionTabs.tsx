import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent, type StyleProp, type TextStyle } from 'react-native';
import { ChevronDown, ChevronUp, Pencil } from 'lucide-react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { ExpandableText } from '@/components/molecules/ExpandableText';

type DescriptionTabsProps = {
  generalLabel: string;
  personalLabel: string;
  generalText?: string;
  personalText?: string;
  /** Se presente, mostra la matita accanto all'etichetta personale (solo quella è modificabile). */
  onEditPersonal?: () => void;
  textStyle: StyleProp<TextStyle>;
};

const SWIPE_DISTANCE_THRESHOLD_RATIO = 0.25;
const SWIPE_VELOCITY_THRESHOLD = 600;
const ANIMATION_DURATION = 220;

/** Due sezioni testuali (descrizione generale/personale) che condividono lo stesso spazio:
 *  titoli in riga (justify-between) cliccabili per passare dall'una all'altra, oppure swipe
 *  orizzontale sul contenuto. La freccia di espansione vive sempre nell'header, accanto al
 *  titolo attivo — mai sovrapposta al testo (posizione fissa, non dipende da dove finisce l'ultima riga).
 *  Solo dati via props, nessuna logica di business. */
export function DescriptionTabs({
  generalLabel,
  personalLabel,
  generalText,
  personalText,
  onEditPersonal,
  textStyle,
}: DescriptionTabsProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const [activeIndex, setActiveIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const translateX = useSharedValue(0);

  const [generalExpanded, setGeneralExpanded] = useState(false);
  const [personalExpanded, setPersonalExpanded] = useState(false);
  const [generalTruncated, setGeneralTruncated] = useState(false);
  const [personalTruncated, setPersonalTruncated] = useState(false);
  useEffect(() => setGeneralExpanded(false), [generalText]);
  useEffect(() => setPersonalExpanded(false), [personalText]);

  const goTo = (index: 0 | 1) => {
    setActiveIndex(index);
    translateX.value = withTiming(-index * width, { duration: ANIMATION_DURATION });
  };

  // Prima misura della larghezza: allinea subito la traccia senza animazione
  useEffect(() => {
    if (width > 0) translateX.value = -activeIndex * width;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      translateX.value = -activeIndex * width + e.translationX;
    })
    .onEnd((e) => {
      const threshold = width * SWIPE_DISTANCE_THRESHOLD_RATIO;
      let nextIndex: 0 | 1 = activeIndex as 0 | 1;
      if (e.translationX < -threshold || e.velocityX < -SWIPE_VELOCITY_THRESHOLD) nextIndex = 1;
      else if (e.translationX > threshold || e.velocityX > SWIPE_VELOCITY_THRESHOLD) nextIndex = 0;
      translateX.value = withTiming(-nextIndex * width, { duration: ANIMATION_DURATION });
      runOnJS(setActiveIndex)(nextIndex);
    });

  const trackStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));

  const activeColor = colors.primary;
  const inactiveColor = hexToRgba(colors.textColor, 0.5);
  const staticColor = hexToRgba(colors.textColor, 0.55);

  // Senza descrizione generale non c'è nulla fra cui passare: niente tab/swipe, solo la personale
  if (!generalText) {
    return (
      <View>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: staticColor }]}>{personalLabel}</Text>
          <View style={styles.rightGroup}>
            {personalTruncated && (
              <Pressable onPress={() => setPersonalExpanded((v) => !v)} hitSlop={4} style={styles.iconButton}>
                {personalExpanded ? (
                  <ChevronUp size={16} color={colors.primary} />
                ) : (
                  <ChevronDown size={16} color={colors.primary} />
                )}
              </Pressable>
            )}
            {onEditPersonal && (
              <Pressable onPress={onEditPersonal} hitSlop={4} style={styles.iconButton}>
                <Pencil size={16} color={colors.primary} />
              </Pressable>
            )}
          </View>
        </View>
        {personalText ? (
          <ExpandableText
            text={personalText}
            style={textStyle}
            expanded={personalExpanded}
            onTruncatedChange={setPersonalTruncated}
          />
        ) : null}
      </View>
    );
  }

  return (
    <View>
      <View style={styles.titleRow}>
        <View style={styles.leftGroup}>
          <Pressable onPress={() => goTo(0)} hitSlop={4} style={styles.titleButton}>
            <Text style={[styles.title, { color: activeIndex === 0 ? activeColor : inactiveColor }]}>{generalLabel}</Text>
          </Pressable>
          {activeIndex === 0 && generalTruncated && (
            <Pressable onPress={() => setGeneralExpanded((v) => !v)} hitSlop={4} style={styles.iconButton}>
              {generalExpanded ? (
                <ChevronUp size={16} color={colors.primary} />
              ) : (
                <ChevronDown size={16} color={colors.primary} />
              )}
            </Pressable>
          )}
        </View>
        <View style={styles.rightGroup}>
          {activeIndex === 1 && personalTruncated && (
            <Pressable onPress={() => setPersonalExpanded((v) => !v)} hitSlop={4} style={styles.iconButton}>
              {personalExpanded ? (
                <ChevronUp size={16} color={colors.primary} />
              ) : (
                <ChevronDown size={16} color={colors.primary} />
              )}
            </Pressable>
          )}
          <Pressable onPress={() => goTo(1)} hitSlop={4} style={styles.titleButton}>
            <Text style={[styles.title, { color: activeIndex === 1 ? activeColor : inactiveColor }]}>{personalLabel}</Text>
          </Pressable>
          {onEditPersonal && (
            <Pressable onPress={onEditPersonal} hitSlop={4} style={styles.iconButton}>
              <Pencil size={16} color={colors.primary} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.viewport} onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.track, trackStyle]}>
            <View style={{ width }}>
              <ExpandableText
                text={generalText}
                style={textStyle}
                expanded={generalExpanded}
                onTruncatedChange={setGeneralTruncated}
              />
            </View>
            <View style={{ width }}>
              {personalText ? (
                <ExpandableText
                  text={personalText}
                  style={textStyle}
                  expanded={personalExpanded}
                  onTruncatedChange={setPersonalTruncated}
                />
              ) : null}
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleButton: {
    paddingVertical: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconButton: {
    padding: 8,
  },
  viewport: {
    overflow: 'hidden',
  },
  track: {
    flexDirection: 'row',
  },
});
