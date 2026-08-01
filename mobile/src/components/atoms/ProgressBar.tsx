import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

type ProgressBarProps = {
  value: number;
};

// --- Dettagli implementativi privati: particelle sparkle animate del riempimento ---

const SPARKLE_PARTICLES = {
  normal: [
    { offset: -7, size: 4, delay: 0, sway: 2, distance: 14 },
    { offset: -2, size: 3.5, delay: 400, sway: -3, distance: 13 },
    { offset: 2, size: 4, delay: 800, sway: 2, distance: 14 },
  ],
  lively: [
    { offset: -10, size: 2.5, delay: 0, sway: 4, distance: 18 },
    { offset: -6, size: 4, delay: 150, sway: -5, distance: 20 },
    { offset: -2, size: 3, delay: 300, sway: 4, distance: 18 },
    { offset: 2, size: 3.5, delay: 450, sway: -4, distance: 20 },
    { offset: 6, size: 2.5, delay: 600, sway: 3, distance: 18 },
  ],
} as const;

/** Scia di scintille che risale dal cursore di avanzamento (barra non ancora piena). */
function ProgressSparkles({ color, intensity }: { color: string; intensity: 'normal' | 'lively' }) {
  const particles = SPARKLE_PARTICLES[intensity];
  const duration = intensity === 'normal' ? 1100 : 700;
  const anims = useRef(particles.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const handles = anims.map((anim, i) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: false }),
        ])
      );
      const timeout = setTimeout(() => loop.start(), particles[i].delay);
      return { loop, timeout };
    });
    return () => handles.forEach((h) => { clearTimeout(h.timeout); h.loop.stop(); });
  }, [intensity]);

  return (
    <View style={{ position: 'absolute', left: -20, bottom: 0, width: 30, height: 30 }}>
      {anims.map((anim, i) => {
        const p = particles[i];
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              bottom: 3,
              left: 12 + p.offset,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: color,
              opacity: anim.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 1, 0] }),
              transform: [
                { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -p.distance] }) },
                {
                  translateX: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, p.sway, 0] }),
                },
                { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0.3] }) },
              ],
            }}
          />
        );
      })}
    </View>
  );
}

const SPARKLE_FIELD_PARTICLES_FULL = [
  { left: '4%', size: 3, delay: 0, sway: 3 },
  { left: '14%', size: 2, delay: 220, sway: -3 },
  { left: '24%', size: 3.5, delay: 440, sway: 4 },
  { left: '34%', size: 2.5, delay: 100, sway: -4 },
  { left: '44%', size: 3, delay: 320, sway: 3 },
  { left: '54%', size: 2, delay: 540, sway: -3 },
  { left: '64%', size: 3.5, delay: 160, sway: 4 },
  { left: '74%', size: 2.5, delay: 380, sway: -4 },
  { left: '84%', size: 3, delay: 60, sway: 3 },
  { left: '92%', size: 2, delay: 280, sway: -3 },
] as const;

const OVERFLOW_SPARKLE_COUNT = 26;
const OVERFLOW_SHUFFLE = [7, 2, 19, 11, 0, 15, 23, 4, 9, 18, 1, 13, 25, 6, 21, 10, 3, 17, 8, 24, 14, 20, 5, 16, 22, 12];
const OVERFLOW_RAW_DELAYS = Array.from({ length: OVERFLOW_SPARKLE_COUNT }, (_, i) => Math.round((i * 1000) / OVERFLOW_SPARKLE_COUNT));

const SPARKLE_FIELD_PARTICLES_OVERFLOW = Array.from({ length: OVERFLOW_SPARKLE_COUNT }, (_, i) => ({
  delay: OVERFLOW_RAW_DELAYS[OVERFLOW_SHUFFLE[i]],
  size: i % 2 === 0 ? 4 : 5.5,
  sway: i % 2 === 0 ? 3 : -4,
}));

/** Campo di scintille distribuite in flex (overflow oltre 100%): risalgono a tappeto lungo la barra piena. */
function ProgressSparkleFieldFlex({ color, particles, duration }: { color: string; particles: readonly { size: number; delay: number; sway: number }[]; duration: number }) {
  const anims = useRef(particles.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const handles = anims.map((anim, i) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: false }),
        ])
      );
      const timeout = setTimeout(() => loop.start(), particles[i].delay);
      return { loop, timeout };
    });
    return () => handles.forEach((h) => { clearTimeout(h.timeout); h.loop.stop(); });
  }, []);

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      {anims.map((anim, i) => {
        const p = particles[i];
        return (
          <Animated.View
            key={i}
            style={{
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: color,
              opacity: anim.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 1, 0] }),
              transform: [
                { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) },
                { translateX: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, p.sway, 0] }) },
                { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0.3] }) },
              ],
            }}
          />
        );
      })}
    </View>
  );
}

/** Campo di scintille a posizioni assolute fisse (barra esattamente piena al 100%). */
function ProgressSparkleField({ color, particles, duration }: { color: string; particles: readonly { left: `${number}%`; size: number; delay: number; sway: number }[]; duration: number }) {
  const anims = useRef(particles.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const handles = anims.map((anim, i) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: false }),
        ])
      );
      const timeout = setTimeout(() => loop.start(), particles[i].delay);
      return { loop, timeout };
    });
    return () => handles.forEach((h) => { clearTimeout(h.timeout); h.loop.stop(); });
  }, []);

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 22 }}>
      {anims.map((anim, i) => {
        const p = particles[i];
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              bottom: 3,
              left: p.left,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: color,
              opacity: anim.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 1, 0] }),
              transform: [
                { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) },
                { translateX: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, p.sway, 0] }) },
                { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0.3] }) },
              ],
            }}
          />
        );
      })}
    </View>
  );
}

/** Barra di avanzamento: fill a soglie (error/warning/success), con scintille animate;
 *  oltre il 100% passa a gradiente + campo di scintille dedicato per l'effetto overflow. */
export function ProgressBar({ value }: ProgressBarProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const isOverflow = value > 100;
  const clampedWidth = Math.min(value, 100);
  const fillColor = value < 40 ? colors.error : value < 100 ? colors.warning : colors.success;
  const sparkleColor = isOverflow ? colors.secondaryGradient : fillColor;
  const isFull = value >= 100;
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: clampedWidth,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [clampedWidth]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%' }}>
      <View style={{ flex: 1, height: 6, position: 'relative' }}>
        {isOverflow && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              height: 2,
              width: widthAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
              borderRadius: 1,
              backgroundColor: 'transparent',
              boxShadow: `0px 2px 13px 2px ${hexToRgba(colors.secondary, 0.4)}`,
            }}
          />
        )}
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            borderRadius: 3,
            backgroundColor: hexToRgba(colors.border, 0.3),
            overflow: 'hidden',
          }}
        >
          {isOverflow ? (
            <Animated.View
              style={{
                height: '100%',
                width: widthAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <LinearGradient
                colors={[colors.secondary, colors.secondaryGradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: '100%', width: '100%' }}
              />
            </Animated.View>
          ) : (
            <Animated.View
              style={{
                height: '100%',
                width: widthAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
                backgroundColor: fillColor,
                borderRadius: 3,
              }}
            />
          )}
        </View>
        {isOverflow ? (
          <ProgressSparkleFieldFlex color={sparkleColor} particles={SPARKLE_FIELD_PARTICLES_OVERFLOW} duration={1100} />
        ) : isFull ? (
          <ProgressSparkleField color={sparkleColor} particles={SPARKLE_FIELD_PARTICLES_FULL} duration={700} />
        ) : (
          value >= 4 && (
            <Animated.View style={{ position: 'absolute', bottom: 0, left: widthAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }}>
              <ProgressSparkles color={sparkleColor} intensity={value >= 40 ? 'lively' : 'normal'} />
            </Animated.View>
          )
        )}
      </View>
      <Text style={{ color: colors.textColor, fontSize: 12, fontWeight: '600', minWidth: 36, textAlign: 'right' }}>{value}%</Text>
    </View>
  );
}
