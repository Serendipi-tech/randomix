import { useEffect, useRef, useState } from 'react';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Animated, Easing, Keyboard, Platform, ScrollView, StyleSheet, Text, TextInput, View, Pressable, useWindowDimensions, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Stop, Circle, Path } from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';
import { Bell, Check, ChevronLeft, Eye, EyeOff, Filter, Flame, Home, Image as ImageIcon, Inbox, LayoutGrid, Lock, MoreHorizontal, Moon, ShieldAlert, Sun, Tag, Users, X, Zap } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { styles } from './colors-showcase.styles';

// ============ TUTTI i componenti copiati dall'auth - SOLO GRAFICA ============

const DICE_SIZE = 108;
const PIP_SIZE = 17;
const GLOW_SIZE = DICE_SIZE + 90;
const PIPS = [
  { top: 18, left: 18 },
  { top: 18, right: 18 },
  { top: '50%' as const, left: '50%' as const, center: true },
  { bottom: 18, left: 18 },
  { bottom: 18, right: 18 },
];

function DiceLogoCopy() {
  return (
    <View style={authStyles.diceContainer}>
      <LinearGradient
        colors={[Colors.light.primary, `${Colors.light.primary}00`]}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={authStyles.diceGlow}
      />
      <View style={authStyles.diceBody}>
        <LinearGradient
          colors={[Colors.light.border, 'transparent']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.6 }}
          style={authStyles.diceBevelHighlight}
        />
        <LinearGradient
          colors={['transparent', Colors.light.extraColors.two]}
          start={{ x: 0.5, y: 0.55 }}
          end={{ x: 0.5, y: 1 }}
          style={authStyles.diceBevelShadow}
        />
        {PIPS.map((pip, i) => (
          <View
            key={i}
            style={[
              authStyles.dicePip,
              {
                top: pip.top,
                left: pip.left,
                right: 'right' in pip ? pip.right : undefined,
                bottom: 'bottom' in pip ? pip.bottom : undefined,
                marginTop: 'center' in pip ? -PIP_SIZE / 2 : undefined,
                marginLeft: 'center' in pip ? -PIP_SIZE / 2 : undefined,
              },
            ]}
          >
            <View style={authStyles.dicePipShine} />
          </View>
        ))}
      </View>
    </View>
  );
}

const authStyles = StyleSheet.create({
  diceContainer: {
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceGlow: {
    position: 'absolute',
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
    opacity: 0.4,
  },
  diceBody: {
    width: DICE_SIZE,
    height: DICE_SIZE,
    borderRadius: 24,
    backgroundColor: Colors.light.extraColors.one,
    borderWidth: 2,
    borderColor: Colors.light.extraColors.three,
    overflow: 'hidden',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 10,
  },
  diceBevelHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    opacity: 0.8,
  },
  diceBevelShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
  },
  dicePip: {
    position: 'absolute',
    width: PIP_SIZE,
    height: PIP_SIZE,
    borderRadius: PIP_SIZE / 2,
    backgroundColor: Colors.light.extraColors.four,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  dicePipShine: {
    width: PIP_SIZE * 0.35,
    height: PIP_SIZE * 0.35,
    borderRadius: PIP_SIZE * 0.2,
    backgroundColor: hexToRgba(Colors.light.border, 0.55),
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 0,
    marginBottom: 12,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    overflow: 'hidden',
    boxShadow: `0px 8px 14px ${hexToRgba(Colors.light.primary, 0.3)}`,
  },
  buttonOutline: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  cardShadowWrapper: {
    borderRadius: 32,
    boxShadow: `0px 16px 28px ${hexToRgba(Colors.light.shadow, 0.35)}`,
    elevation: 16,
    overflow: 'hidden',
  },
  cardClip: {
    flex: 1,
    borderRadius: 32,
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 300,
  },
  cardScroll: {
    flex: 1,
  },
  cardScrollContent: {
    flexGrow: 1,
    padding: 24,
    gap: 20,
    justifyContent: 'flex-start',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    padding: 10,
  },
  featureIconShadowWrapper: {
    borderRadius: 15,
    boxShadow: `0px 3px 6px ${hexToRgba(Colors.light.shadow, 0.18)}`,
  },
  featureIconClip: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  featureIconStack: {
    position: 'relative',
    zIndex: 1,
  },
  featureRowTextZone: {
    flex: 1,
    gap: 1,
  },
  featureRowTitle: {
    fontSize: 16,
  },
  featureRowSubtitle: {
    fontSize: 13,
    lineHeight: 17,
  },
  passwordInputWrap: { justifyContent: 'center' },
  passwordInputIcons: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

function FeatureRowCopy({ Icon, tint, gradient, title, subtitle, colorScheme }: { Icon: React.ComponentType<any>; tint: string; gradient: readonly [string, string]; title: string; subtitle: string; colorScheme: 'light' | 'dark' }) {
  const colors = Colors[colorScheme];
  const textColor = colors.text;
  const subtitleColor = colors.textSecondary;

  return (
    <View style={[authStyles.featureRow, { backgroundColor: `${tint}1F` }]}>
      <View style={authStyles.featureIconShadowWrapper}>
        <View style={authStyles.featureIconClip}>
          <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <View style={authStyles.featureIconStack}>
            <Icon size={22} color={Colors.light.border} strokeWidth={2.5} />
          </View>
        </View>
      </View>
      <View style={authStyles.featureRowTextZone}>
        <Text style={[authStyles.featureRowTitle, { color: textColor }]}>{title}</Text>
        <Text style={[authStyles.featureRowSubtitle, { color: subtitleColor }]}>{subtitle}</Text>
      </View>
    </View>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'confirm' | 'gradient';

function Button({ variant, colors, label, flex, loading }: { variant: ButtonVariant; colors: typeof ShowcaseColors.light | typeof ShowcaseColors.dark; label?: string; flex?: number; loading?: boolean }) {
  const displayLabel = label || variant.charAt(0).toUpperCase() + variant.slice(1);
  const pressTransition: ViewStyle = Platform.OS === 'web' ? ({ transitionProperty: 'transform', transitionDuration: '80ms' } as ViewStyle) : {};

  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          borderWidth: 0,
          borderColor: undefined,
          textColor: colors.textColor,
          rippleColor: colors.foreground,
          fontWeight: '600' as const,
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primary,
          textColor: colors.primary,
          rippleColor: colors.primary,
          fontWeight: '600' as const,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
          textColor: colors.border,
          rippleColor: colors.textColor,
          fontWeight: '600' as const,
        };
      case 'destructive':
        return {
          backgroundColor: hexToRgba(colors.error, 0.2),
          borderWidth: 1,
          borderColor: colors.error,
          textColor: colors.error,
          rippleColor: colors.error,
          fontWeight: '700' as const,
        };
      case 'confirm':
        return {
          backgroundColor: hexToRgba(colors.success, 0.2),
          borderWidth: 1,
          borderColor: colors.success,
          textColor: colors.success,
          rippleColor: colors.success,
          fontWeight: '600' as const,
        };
      case 'gradient':
        return {
          isGradient: true,
          textColor: colors.textColor,
          fontWeight: '600' as const,
        };
      default:
        return {};
    }
  };

  const buttonStyles = getButtonStyles();

  if (variant === 'gradient') {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressTransition,
          { overflow: 'hidden', flex, ...(pressed && !loading ? { transform: [{ scale: 0.97 }] } : {}) },
        ]}
        onPress={() => { }}
        disabled={loading}
        android_ripple={{ color: colors.textColor, radius: 8 }}
      >
        <LinearGradient
          colors={[colors.secondary, colors.secondaryGradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={{ height: 18, justifyContent: 'center', alignItems: 'center' }}>
          {loading ? (
            <ActivityIndicator size="small" color={buttonStyles.textColor} />
          ) : (
            <Text style={[styles.buttonText, { color: buttonStyles.textColor, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: buttonStyles.fontWeight }]}>
              {displayLabel}
            </Text>
          )}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressTransition,
        {
          backgroundColor: buttonStyles.backgroundColor,
          borderWidth: buttonStyles.borderWidth,
          borderColor: buttonStyles.borderColor,
          flex,
          ...(pressed && !loading ? { transform: [{ scale: 0.97 }] } : {}),
        },
      ]}
      onPress={() => { }}
      disabled={loading}
      android_ripple={{ color: buttonStyles.rippleColor, radius: 8 }}
    >
      <View style={{ height: 18, justifyContent: 'center', alignItems: 'center' }}>
        {loading ? (
          <ActivityIndicator size="small" color={buttonStyles.textColor} />
        ) : (
          <Text style={[styles.buttonText, { color: buttonStyles.textColor, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: buttonStyles.fontWeight }]}>
            {displayLabel}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

type InputVariant = 'text' | 'password' | 'textarea';

const PASSWORD_STRENGTH_RULES = [
  { label: 'At least 8 characters', met: true },
  { label: 'Contains a letter', met: true },
  { label: 'Contains a number', met: false },
  { label: 'Contains a special character', met: false },
] as const;

function PasswordStrengthIndicatorCopy({ colors }: { colors: typeof ShowcaseColors.light | typeof ShowcaseColors.dark }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const level: 'weak' | 'medium' | 'strong' = 'medium';
  const levelColor = { weak: colors.error, medium: colors.warning, strong: colors.success }[level];

  useEffect(() => {
    setAnimating(true);
    if (open) {
      setMounted(true);
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: Platform.OS !== 'web' }).start(() => {
        setAnimating(false);
      });
    } else {
      Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: Platform.OS !== 'web' }).start(() => {
        setMounted(false);
        setAnimating(false);
      });
    }
  }, [open]);

  return (
    <View style={{ justifyContent: 'center' }}>
      <Pressable onPress={() => setOpen((v) => !v)} hitSlop={6}>
        <ShieldAlert size={20} color={levelColor} />
      </Pressable>

      {mounted && (
        <Animated.View
          pointerEvents={open ? 'auto' : 'none'}
          style={{
            position: 'absolute',
            right: -8,
            bottom: 28,
            width: 220,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: hexToRgba(colors.border, 0.5),
            overflow: 'hidden',
            boxShadow: `0px 8px 20px ${hexToRgba(colors.shadow, 0.35)}`,
            zIndex: 20,
            elevation: 8,
            opacity: fadeAnim,
            ...(animating
              ? {
                transform: [
                  { scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
                  { translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) },
                ],
              }
              : {}),
          }}
        >
          <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: hexToRgba(colors.foreground, 0.6) }]} />
          <View style={{ padding: 14, gap: 8 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textColor }}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Text>
            {PASSWORD_STRENGTH_RULES.map((rule) => (
              <View key={rule.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {rule.met ? <Check size={15} color={colors.success} /> : <X size={15} color={colors.error} />}
                <Text style={{ fontSize: 14, color: colors.textColor }}>{rule.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

function Input({ variant, colors, placeholder }: { variant: InputVariant; colors: typeof ShowcaseColors.light | typeof ShowcaseColors.dark; placeholder?: string }) {
  const [value, setValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const defaultPlaceholder = variant === 'password' ? 'Password' : variant === 'textarea' ? 'Write something...' : 'Text input';

  return (
    <View
      style={[
        styles.input,
        {
          backgroundColor: colors.foreground,
          borderColor: isFocused ? colors.primary : colors.border,
          flexDirection: 'row',
          alignItems: variant === 'textarea' ? 'flex-start' : 'center',
        },
      ]}
    >
      <TextInput
        value={value}
        onChangeText={setValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder || defaultPlaceholder}
        placeholderTextColor={colors.disabled}
        secureTextEntry={variant === 'password' && !showPassword}
        multiline={variant === 'textarea'}
        numberOfLines={variant === 'textarea' ? 4 : undefined}
        style={[
          { flex: 1, color: colors.textColor, fontSize: 14 },
          variant === 'textarea' ? { minHeight: 80, textAlignVertical: 'top' } : {},
          Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {},
        ]}
      />
      {variant === 'password' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <PasswordStrengthIndicatorCopy colors={colors} />
          <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
            {showPassword ? (
              <EyeOff size={18} color={colors.border} />
            ) : (
              <Eye size={18} color={colors.border} />
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

function Chip({ label, selected, disabled, colors, onPress }: { label: string; selected: boolean; disabled?: boolean; colors: typeof ShowcaseColors.light | typeof ShowcaseColors.dark; onPress: () => void }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingVertical: 7,
          paddingHorizontal: 14,
          borderRadius: 6,
          borderWidth: 1,
          backgroundColor: selected ? colors.primary : 'transparent',
          borderColor: selected ? colors.primary : colors.border,
          opacity: disabled ? 0.4 : 1,
        },
        pressed && !disabled ? { transform: [{ scale: 0.96 }] } : {},
      ]}
    >
      <Text style={{ color: colors.textColor, fontSize: 14, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Text>
    </Pressable>
  );
}

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

function ProgressBar({ value, colors }: { value: number; colors: typeof ShowcaseColors.light | typeof ShowcaseColors.dark }) {
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
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
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
      <Text style={{ color: colors.textColor, fontSize: 12, fontWeight: '600', minWidth: 36 }}>{value}%</Text>
    </View>
  );
}

function SkeletonLine({ colors, width }: { colors: typeof ShowcaseColors.light | typeof ShowcaseColors.dark; width?: `${number}%` }) {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeletonLine,
        {
          width: width ?? '100%',
          backgroundColor: hexToRgba(colors.border, 0.5),
          opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0.95] }),
          boxShadow: `0px 0px 6px ${hexToRgba(colors.border, 0.3)}`,
        },
      ]}
    />
  );
}

type FilterGroup = { label: string; options: Array<{ label: string; value: string }> };

const FILTER_GROUPS: FilterGroup[] = [
  {
    label: 'Genere',
    options: [
      { label: 'Fantasy', value: 'fantasy' },
      { label: 'Sci-Fi', value: 'scifi' },
      { label: 'Romance', value: 'romance' },
    ],
  },
  {
    label: 'Stato',
    options: [
      { label: 'Letto', value: 'letto' },
      { label: 'In corso', value: 'in_corso' },
      { label: 'Da leggere', value: 'da_leggere' },
    ],
  },
];

function FilterButton({ colors, active, onPress }: { colors: typeof ShowcaseColors.light | typeof ShowcaseColors.dark; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: active ? colors.primary : colors.border,
        backgroundColor: active ? hexToRgba(colors.primary, 0.12) : colors.foreground,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Filter size={20} color={active ? colors.primary : colors.textColor} />
    </Pressable>
  );
}

function FilterBottomSheet({
  colors,
  visible,
  onClose,
  groups,
  selected,
  onToggle,
}: {
  colors: typeof ShowcaseColors.light | typeof ShowcaseColors.dark;
  visible: boolean;
  onClose: () => void;
  groups: FilterGroup[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const { height: screenHeight } = useWindowDimensions();
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const keyboardOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(translateY, { toValue: 0, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }).start();
    } else {
      Keyboard.dismiss();
      Animated.timing(translateY, { toValue: screenHeight, duration: 220, easing: Easing.in(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }).start(() => {
        setMounted(false);
        setSearch('');
      });
    }
  }, [visible]);

  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvt, (e) => {
      Animated.timing(keyboardOffset, { toValue: e.endCoordinates.height, duration: 220, useNativeDriver: Platform.OS !== 'web' }).start();
    });
    const hideSub = Keyboard.addListener(hideEvt, () => {
      Animated.timing(keyboardOffset, { toValue: 0, duration: 220, useNativeDriver: Platform.OS !== 'web' }).start();
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const filteredGroups = groups
    .map((group) => ({
      ...group,
      options: group.options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase())),
    }))
    .filter((group) => group.options.length > 0);

  if (!mounted && !visible) return null;

  return (
    <>
      <Pressable onPress={onClose} style={StyleSheet.absoluteFill}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: hexToRgba(colors.shadow, 0.45),
              opacity: translateY.interpolate({ inputRange: [0, screenHeight], outputRange: [1, 0], extrapolate: 'clamp' }),
            },
          ]}
        />
      </Pressable>
      <Animated.View
        style={{
          position: 'absolute',
          left: 12,
          right: 12,
          bottom: 0,
          maxHeight: screenHeight * 0.7,
          borderRadius: 20,
          backgroundColor: colors.foreground,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: 'hidden',
          boxShadow: `0px -8px 24px ${hexToRgba(colors.shadow, 0.3)}`,
          transform: [{ translateY: Animated.subtract(translateY, keyboardOffset) }],
        }}
      >
        <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 6 }}>
          <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: hexToRgba(colors.border, 0.6) }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 10 }}>
          <Text style={{ color: colors.textColor, fontSize: 17, fontWeight: '700' }}>Filtri</Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <X size={20} color={colors.border} />
          </Pressable>
        </View>
        <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
          <View
            style={[
              styles.input,
              { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, marginBottom: 0, flexDirection: 'row', alignItems: 'center' },
            ]}
          >
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Cerca..."
              placeholderTextColor={colors.disabled}
              style={[{ flex: 1, color: colors.textColor, fontSize: 14 }, Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}]}
            />
          </View>
        </View>
        <ScrollView
          style={[{ flexGrow: 0 }, Platform.OS === 'web' ? ({ scrollbarWidth: 'none' } as any) : {}]}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {filteredGroups.length === 0 && <Text style={{ color: colors.disabled, fontSize: 13, paddingHorizontal: 16, paddingVertical: 12 }}>Nessun risultato</Text>}
          {filteredGroups.map((group) => (
            <View key={group.label}>
              <Text
                style={{
                  color: colors.textColor,
                  opacity: 0.55,
                  fontSize: 11,
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  paddingHorizontal: 16,
                  paddingTop: 10,
                  paddingBottom: 4,
                }}
              >
                {group.label}
              </Text>
              {group.options.map((opt) => {
                const isSelected = selected.includes(opt.value);
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => onToggle(opt.value)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, paddingHorizontal: 16 }}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        { backgroundColor: 'transparent', borderColor: colors.border, borderWidth: 1.5, overflow: 'hidden' },
                        Platform.OS === 'web' ? ({ contain: 'paint' } as ViewStyle) : {},
                      ]}
                    >
                      <LinearGradient
                        colors={[colors.secondary, colors.secondaryGradient]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                          StyleSheet.absoluteFill,
                          { alignItems: 'center', justifyContent: 'center', opacity: isSelected ? 1 : 0 },
                          Platform.OS === 'web' ? ({ transitionProperty: 'opacity, transform', transitionDuration: '150ms' } as ViewStyle) : {},
                          { transform: [{ scale: isSelected ? 1 : 0.5 }] },
                        ]}
                      >
                        <Check size={14} color={colors.textColor} strokeWidth={3} />
                      </LinearGradient>
                    </View>
                    <Text style={{ color: colors.textColor, fontSize: 14 }}>{opt.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </>
  );
}

function RatingStar({ active, color, inactiveColor, onPress }: { active: boolean; color: string; inactiveColor: string; onPress: () => void }) {
  const fillAnim = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fillAnim, { toValue: active ? 1 : 0, duration: 250, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
  }, [active]);

  return (
    <Pressable onPress={onPress}>
      <View style={{ width: 20, height: 20 }}>
        <Text style={{ position: 'absolute', color: inactiveColor, fontSize: 20 }}>★</Text>
        <Animated.View
          style={{
            position: 'absolute',
            overflow: 'hidden',
            height: '100%',
            width: fillAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          }}
        >
          <Text style={{ color, fontSize: 20 }}>★</Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}

function Spinner({ color, track }: { color: string; track: string }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.spinner,
        {
          borderColor: track,
          borderTopColor: color,
          transform: [{ rotate: rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
        },
      ]}
    />
  );
}

function TagLabel({ name, color, textColor, useIcon }: { name: string; color: string; textColor: string; useIcon?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 6, backgroundColor: hexToRgba(color, 0.15) }}>
      {useIcon ? <Tag size={14} color={color} strokeWidth={2.5} /> : <Text style={{ color, fontSize: 14, fontWeight: '700' }}>#</Text>}
      <Text style={{ color: textColor, fontSize: 13, fontWeight: '600' }}>{name}</Text>
    </View>
  );
}

type CardVariant = 'outlined' | 'filled' | 'action' | 'profile' | 'item' | 'challenge' | 'notification';

type CardProps = {
  variant: CardVariant;
  colors: typeof ShowcaseColors.light | typeof ShowcaseColors.dark;
  title: string;
  description?: string;
  actionLabel?: string;
  profileHandle?: string;
  itemCategory?: string;
  itemStatus?: keyof (typeof STATUS_ENUM_COLOR_MAP)['STATUS_COMPLETION'];
  challengeProgress?: number;
  challengeGoal?: number;
  challengeTimeframe?: string;
  notificationBody?: string;
  notificationTime?: string;
  notificationUnread?: boolean;
};

function Card({
  variant,
  colors,
  title,
  description,
  actionLabel,
  profileHandle,
  itemCategory,
  itemStatus,
  challengeProgress,
  challengeGoal,
  challengeTimeframe,
  notificationBody,
  notificationTime,
  notificationUnread,
}: CardProps) {
  if (variant === 'item') {
    return (
      <View style={[styles.card, { backgroundColor: colors.foreground, borderColor: colors.border, flexDirection: 'row', gap: 12, padding: 12 }]}>
        <View style={{ width: 56, height: 56, borderRadius: 10, backgroundColor: hexToRgba(colors.primary, 0.15), alignItems: 'center', justifyContent: 'center' }}>
          <ImageIcon size={22} color={colors.primary} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ color: colors.textColor, fontWeight: '700', fontSize: 15 }}>{title}</Text>
          {itemCategory && (
            <Text style={{ color: colors.textColor, fontSize: 12, opacity: 0.7 }}>{itemCategory}</Text>
          )}
          {itemStatus && <StatusBadge enumName="STATUS_COMPLETION" value={itemStatus} colors={colors} />}
        </View>
      </View>
    );
  }

  if (variant === 'challenge') {
    const progress = challengeProgress ?? 0;
    const goal = challengeGoal ?? 1;
    const pct = Math.round((progress / goal) * 100);
    return (
      <View style={[styles.card, { backgroundColor: colors.foreground, borderColor: colors.border }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textColor, fontWeight: '700', fontSize: 16, marginBottom: 2 }}>{title}</Text>
            {challengeTimeframe && (
              <Text style={{ color: colors.textColor, fontSize: 12, opacity: 0.7 }}>{challengeTimeframe}</Text>
            )}
          </View>
          <StatusBadge enumName="STATUS_CHALLENGE" value="IN_PROGRESS" colors={colors} />
        </View>
        <ProgressBar value={pct} colors={colors} />
        <Text style={{ color: colors.textColor, fontSize: 12, marginTop: 6, opacity: 0.7 }}>
          {progress} / {goal} completati
        </Text>
      </View>
    );
  }

  if (variant === 'notification') {
    return (
      <View style={[styles.card, { backgroundColor: colors.foreground, borderColor: colors.border, flexDirection: 'row', gap: 12 }]}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: hexToRgba(colors.primary, 0.15), alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={18} color={colors.primary} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: colors.textColor, fontWeight: '700', fontSize: 15, flex: 1 }}>{title}</Text>
            {notificationUnread && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }} />}
          </View>
          {notificationBody && <Text style={{ color: colors.textColor, fontSize: 13, opacity: 0.8 }}>{notificationBody}</Text>}
          {notificationTime && <Text style={{ color: colors.textColor, fontSize: 11, opacity: 0.5, marginTop: 2 }}>{notificationTime}</Text>}
        </View>
      </View>
    );
  }

  if (variant === 'filled') {
    return (
      <LinearGradient
        colors={[colors.secondary, colors.secondaryGradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { borderWidth: 0 }]}
      >
        <Text style={{ color: colors.textColor, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
          Filled
        </Text>
        <Text style={{ color: colors.textColor, fontWeight: '700', fontSize: 18, marginBottom: 6 }}>{title}</Text>
        {description && (
          <Text style={{ color: colors.textColor, fontSize: 15, lineHeight: 21 }}>{description}</Text>
        )}
      </LinearGradient>
    );
  }

  if (variant === 'action') {
    return (
      <View style={[styles.card, { backgroundColor: colors.foreground, borderColor: colors.border }]}>
        <Text style={{ color: colors.textColor, fontWeight: '700', fontSize: 16, marginBottom: 4 }}>{title}</Text>
        {description && (
          <Text style={{ color: colors.textColor, fontSize: 14, marginBottom: 12 }}>{description}</Text>
        )}
        <Button variant="primary" colors={colors} label={actionLabel} />
      </View>
    );
  }

  if (variant === 'profile') {
    return (
      <View style={[styles.card, { backgroundColor: colors.foreground, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
          <Users size={22} color={colors.textColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.textColor, fontWeight: '700', fontSize: 16 }}>{title}</Text>
          {profileHandle && <Text style={{ color: colors.textColor, fontSize: 14 }}>{profileHandle}</Text>}
        </View>
        <Pressable hitSlop={8}>
          <MoreHorizontal size={20} color={colors.textColor} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.foreground, borderColor: colors.border }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary }} />
        <Text style={{ color: colors.textColor, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Outlined
        </Text>
      </View>
      <Text style={{ color: colors.textColor, fontWeight: '700', fontSize: 18, marginBottom: 6 }}>{title}</Text>
      {description && <Text style={{ color: colors.textColor, fontSize: 15, lineHeight: 21 }}>{description}</Text>}
    </View>
  );
}

type StatusColorKey = 'success' | 'warning' | 'error' | 'info' | 'border';

const STATUS_ENUM_COLOR_MAP = {
  STATUS_COMPLETION: {
    NOT_STARTED: 'border',
    IN_PROGRESS: 'info',
    COMPLETED: 'success',
  },
  STATUS_CHALLENGE: {
    DRAFT: 'border',
    NOT_STARTED: 'border',
    IN_PROGRESS: 'info',
    COMPLETED: 'success',
    FAILED: 'error',
  },
  STATUS_SUBSCRIPTION: {
    ACTIVE: 'success',
    PAST_DUE: 'warning',
    CANCELED: 'border',
    UNPAID: 'error',
  },
  STATUS_FRIENDSHIP: {
    PENDING: 'warning',
    ACCEPTED: 'success',
    REJECTED: 'error',
    CANCELED: 'border',
  },
  STATUS_PAYMENT: {
    SUCCESS: 'success',
    PENDING: 'warning',
    FAILED: 'error',
  },
  STATUS_REPORT: {
    SENT: 'info',
    IN_PROGRESS: 'warning',
    SOLVED: 'success',
    REJECTED: 'error',
  },
} as const satisfies Record<string, Record<string, StatusColorKey>>;

type StatusEnumName = keyof typeof STATUS_ENUM_COLOR_MAP;

function StatusBadge<E extends StatusEnumName>({ enumName, value, colors }: { enumName: E; value: keyof (typeof STATUS_ENUM_COLOR_MAP)[E]; colors: typeof ShowcaseColors.light | typeof ShowcaseColors.dark }) {
  const colorKey = STATUS_ENUM_COLOR_MAP[enumName][value] as StatusColorKey;
  const color = colors[colorKey];

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={[styles.statusDot, { backgroundColor: color, borderColor: color }]} />
      <Text style={{ color: colors.textColor, fontSize: 13, fontWeight: '500' }}>
        {String(value).replace(/_/g, ' ')}
      </Text>
    </View>
  );
}

const ShowcaseColors = {
  light: {
    /* background: '#F2F8FC',
    backgroundRadial: '#a8c5d6',
    foreground: '#d5e6f0', */
    background: '#F4F1F8',
    backgroundRadial: '#c7a8d6',
    foreground: '#e0d5e7', // vecchio, più freddo: "#1f1b3b";

    primary: 'rgb(136, 101, 255)',
    secondary: 'rgb(252, 198, 74)',
    secondaryGradient: '#FF6B6B',

    accent: '#42f5dd',

    error: '#eb3040',
    warning: '#fda129',
    info: '#39c3ff',
    success: '#31db64',

    shadow: '#000000',

    border: '#c2b1cc',

    disabled: '#495d79',

    textColor: '#191024',

    extraColors: {
      one: 'rgb(255, 73, 90)',
      two: 'rgb(241, 228, 85)',
      three: 'rgb(73, 103, 255)',
      four: 'rgb(107, 255, 73)',
      five: 'rgb(255, 155, 73)',
      six: "rgb(178, 73, 255)",
      seven: "rgb(73, 255, 181)",
      eight: "rgb(255, 73, 215)",
      nine: "rgb(73, 218, 255)",
      ten: "rgb(231, 255, 73)",
    },
  },
  dark: {
    background: '#191024',
    backgroundRadial: '#7b2a86',
    foreground: '#261b3b', // vecchio, più freddo: "#1f1b3b";

    primary: '#7154e7',
    secondary: '#f7c041',
    secondaryGradient: '#FF6B6B',

    accent: '#1dffe1',

    error: '#eb3040',
    warning: '#fda129',
    info: '#39c3ff',
    success: '#40fd79',

    shadow: '#000000',

    border: '#334155',

    disabled: '#5c7597',

    textColor: '#fdfcf5',

    extraColors: {
      one: '#e63d4b',
      two: '#e6c73d',
      three: '#3d56e6',
      four: '#59e63d',
      five: '#e6813d',
      six: "#943de6",
      seven: "#3de697",
      eight: "#e63db3",
      nine: "#3db6e6",
      ten: "#c1e63d",
    },
  },
} as const;

// Navbar constants copied from app-tabs
const BAR_HEIGHT = 68;
const CORNER = 12;
const NOTCH_HALF_WIDTH = 76;
const NOTCH_DEPTH = 64;

const SIDE_TAB_ICONS = {
  profile: Users,
  notifications: Bell,
  friends: Users,
  groups: LayoutGrid,
} as const;

type SideTabName = keyof typeof SIDE_TAB_ICONS;

function buildWavePath(width: number): string {
  const cx = width / 2;
  const left = cx - NOTCH_HALF_WIDTH;
  const right = cx + NOTCH_HALF_WIDTH;

  return [
    `M ${CORNER} 0`,
    `L ${left} 0`,
    `C ${left + 37} 0 ${cx - 40} ${NOTCH_DEPTH} ${cx} ${NOTCH_DEPTH}`,
    `C ${cx + 40} ${NOTCH_DEPTH} ${right - 37} 0 ${right} 0`,
    `L ${width - CORNER} 0`,
    `A ${CORNER} ${CORNER} 0 0 1 ${width} ${CORNER}`,
    `L ${width} ${BAR_HEIGHT - CORNER}`,
    `A ${CORNER} ${CORNER} 0 0 1 ${width - CORNER} ${BAR_HEIGHT}`,
    `L ${CORNER} ${BAR_HEIGHT}`,
    `A ${CORNER} ${CORNER} 0 0 1 0 ${BAR_HEIGHT - CORNER}`,
    `L 0 ${CORNER}`,
    `A ${CORNER} ${CORNER} 0 0 1 ${CORNER} 0`,
    'Z',
  ].join(' ');
}

function ShowColorPalette({
  title,
  items,
  colors,
  gradient,
}: {
  title: string;
  items: Array<{ name: string; color: string }>;
  colors: typeof ShowcaseColors.light | typeof ShowcaseColors.dark;
  gradient?: { colors: [string, string]; name: string };
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textColor }]}>{title}</Text>
      <View style={[styles.swatchGrid, { width: '100%' }]}>
        {items.map((item) => (
          <View key={item.name} style={styles.swatchItem}>
            <View style={[styles.swatchBox, { backgroundColor: item.color }]}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.border }}>
                {item.name.toUpperCase()}
              </Text>
            </View>
          </View>
        ))}
        {gradient && (
          <View style={styles.swatchItem}>
            <LinearGradient
              colors={gradient.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.gradientBox, { width: '100%' }]}
            >
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.border }}>
                {gradient.name.toUpperCase()}
              </Text>
            </LinearGradient>
          </View>
        )}
      </View>
    </View>
  );
}

function SideTabButton({ name, isActive, onPress, mutedColor, activeColor }: { name: SideTabName; isActive: boolean; onPress: () => void; mutedColor: string; activeColor: string }) {
  const Icon = SIDE_TAB_ICONS[name];
  const color = isActive ? activeColor : mutedColor;
  return (
    <Pressable style={styles.sideTab} hitSlop={6} onPress={onPress}>
      <Icon size={24} color={color} fill={isActive ? color : 'none'} strokeWidth={2} />
    </Pressable>
  );
}

function HomeButtonComp() {
  return (
    <Pressable style={[styles.homeButton, { backgroundColor: Colors.light.primary }]} hitSlop={6}>
      <View style={styles.homeIconStack}>
        <Home size={24} color={Colors.light.border} strokeWidth={2.5} />
      </View>
    </Pressable>
  );
}

function PageHeader({
  icon,
  title,
  subtitle,
  colors,
  onBack,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  colors: typeof ShowcaseColors.light | typeof ShowcaseColors.dark;
  onBack?: () => void;
}) {
  return (
    <View style={styles.pageHeaderWrapper}>
      <View style={styles.pageHeaderTopRow}>
        <View style={styles.pageHeaderContent}>
          <LinearGradient
            colors={[colors.secondary, colors.secondaryGradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pageHeaderIcon}
          >
            {icon}
          </LinearGradient>
          <Text style={[styles.pageHeaderTitle, { color: colors.textColor }]}>{title}</Text>
        </View>
        {onBack && (
          <Pressable onPress={onBack} hitSlop={8}>
            <ChevronLeft size={24} color={colors.textColor} />
          </Pressable>
        )}
      </View>
      {subtitle && <Text style={styles.pageHeaderSubtitle}>{subtitle}</Text>}
    </View>
  );
}

function NavBar({ colorScheme, isDark, setIsDark, activeTab, toggleTab }: { colorScheme: 'light' | 'dark'; isDark: boolean; setIsDark: (val: boolean) => void; activeTab: 'profile' | 'notifications' | 'friends' | null; toggleTab: (tab: 'profile' | 'notifications' | 'friends') => void }) {
  const colors = ShowcaseColors[colorScheme];
  const fill =
    colorScheme === 'light'
      ? hexToRgba(colors.primary, 0.2)
      : hexToRgba(colors.primary, 0.2);
  const borderColor = hexToRgba(colors.border, colorScheme === 'light' ? 0.5 : 0.16);
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  const mutedColor = colors.primary;
  const activeColor = colors.secondary;

  // Blur ritagliato a forma navbar: su web clip-path CSS (MaskedView rompe il backdrop-filter),
  // su nativo MaskedView + BlurView
  const wavePath = buildWavePath(width);
  const blurLayer =
    Platform.OS === 'web' ? (
      <View
        pointerEvents="none"
        style={[
          styles.clip,
          { width, height: BAR_HEIGHT, backgroundColor: hexToRgba(colors.foreground, 0.15) },
          {
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            clipPath: `path('${wavePath}')`,
            WebkitClipPath: `path('${wavePath}')`,
          } as unknown as ViewStyle,
        ]}
      />
    ) : (
      <MaskedView
        style={[styles.clip, { width, height: BAR_HEIGHT }]}
        pointerEvents="none"
        maskElement={
          <Svg width={width} height={BAR_HEIGHT}>
            <Path d={wavePath} fill="#fff" />
          </Svg>
        }
      >
        <BlurView intensity={90} style={StyleSheet.absoluteFill} tint="dark" />
      </MaskedView>
    );

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: 12 }]}>
      <View style={styles.pillWrap} onLayout={onLayout}>
        {width > 0 && (
          <>
            {blurLayer}
            <View style={styles.clip} pointerEvents="box-none">
              <Svg width={width} height={BAR_HEIGHT} style={StyleSheet.absoluteFill}>
                <Path d={buildWavePath(width)} fill={fill} stroke={borderColor} strokeWidth={1} />
              </Svg>
              <View style={styles.row}>
                <SideTabButton name="profile" isActive={activeTab === 'profile'} onPress={() => toggleTab('profile')} mutedColor={mutedColor} activeColor={activeColor} />
                <SideTabButton name="notifications" isActive={activeTab === 'notifications'} onPress={() => toggleTab('notifications')} mutedColor={mutedColor} activeColor={activeColor} />
                <HomeButtonComp />
                <SideTabButton name="friends" isActive={activeTab === 'friends'} onPress={() => toggleTab('friends')} mutedColor={mutedColor} activeColor={activeColor} />
                <View style={styles.themeToggle}>
                  <Pressable hitSlop={8} onPress={() => setIsDark(!isDark)}>
                    {isDark ? (
                      <Sun size={24} color={activeColor} />
                    ) : (
                      <Moon size={24} color={activeColor} />
                    )}
                  </Pressable>
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

export default function ColorsShowcase() {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'friends' | null>(null);
  const [showColorSections, setShowColorSections] = useState(true);
  const [chipState, setChipState] = useState<Record<string, boolean>>({ Active: true, Inactive: false, Disabled: false });
  const [checkboxState, setCheckboxState] = useState<Record<string, boolean>>({ Unchecked: false, Checked: true, Indeterminate: false });
  const [radioState, setRadioState] = useState('Option A');
  const [toggleState, setToggleState] = useState<Record<string, boolean>>({ 'true': true, 'false': false });
  const [currentPage, setCurrentPage] = useState(3);
  const [rating, setRating] = useState(4);
  const [currentTabIdx, setCurrentTabIdx] = useState(0);
  const [buttonsLoading, setButtonsLoading] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [filterSelected, setFilterSelected] = useState<string[]>([]);

  const colorScheme = isDark ? 'dark' : 'light';
  const colors = ShowcaseColors[colorScheme];

  const toggleTab = (tab: 'profile' | 'notifications' | 'friends') => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const toggleFilterValue = (value: string) => {
    setFilterSelected((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Svg
        width="100%"
        height={450}
        viewBox="0 0 400 400"
        style={styles.radialGradientSvg}
      >
        <Defs>
          <RadialGradient id="radialGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={colors.backgroundRadial} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={colors.backgroundRadial} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="200" cy="200" r="200" fill="url(#radialGlow)" />
      </Svg>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader
          icon={<Zap size={24} color="#ffffff" />}
          title="Design System"
          colors={colors}
          onBack={() => { }}
        />

        {/* Toggle Color Sections */}
        <Pressable
          onPress={() => setShowColorSections(!showColorSections)}
          style={{
            paddingHorizontal: 16,
            marginBottom: 16,
            paddingVertical: 12,
            backgroundColor: colors.foreground,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.textColor, fontWeight: '600' }}>
            {showColorSections ? 'Hide' : 'Show'} Color Sections
          </Text>
        </Pressable>

        {showColorSections && (
          <>
            {/* Color Swatches */}
            <ShowColorPalette
              title="Primary Colors"
              items={[
                { name: 'Primary', color: colors.primary },
                { name: 'Secondary', color: colors.secondary },
                { name: 'Accent', color: colors.accent },
                { name: 'Foreground', color: colors.foreground },
              ]}
              colors={colors}
              gradient={{
                colors: [colors.secondary, colors.secondaryGradient || colors.secondary],
                name: 'Gradient',
              }}
            />

            {/* Semantic Colors */}
            <ShowColorPalette
              title="Semantic Colors"
              items={[
                { name: 'Success', color: colors.success },
                { name: 'Warning', color: colors.warning },
                { name: 'Error', color: colors.error },
                { name: 'Info', color: colors.info },
                { name: 'Text', color: colors.textColor },
                { name: 'Border', color: colors.border },
              ]}
              colors={colors}
            />

            {/* Extra Colors */}
            <ShowColorPalette
              title="Extra Palette"
              items={Object.entries(colors.extraColors).map(([key, color]) => ({
                name: key,
                color,
              }))}
              colors={colors}
            />
          </>
        )}

        {/* Button Examples */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={[styles.sectionTitle, { color: colors.textColor, marginBottom: 0 }]}>Buttons</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable onPress={() => setButtonsLoading(true)}>
                <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '600' }}>Load</Text>
              </Pressable>
              <Pressable onPress={() => setButtonsLoading(false)}>
                <Text style={{ color: colors.border, fontSize: 13, fontWeight: '600' }}>Unload</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.buttonStack}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button variant="primary" colors={colors} flex={1} loading={buttonsLoading} />
              <Button variant="secondary" colors={colors} flex={1} loading={buttonsLoading} />
            </View>
            <Button variant="ghost" colors={colors} loading={buttonsLoading} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button variant="destructive" colors={colors} flex={1} loading={buttonsLoading} />
              <Button variant="confirm" colors={colors} flex={1} loading={buttonsLoading} />
            </View>
            <Button variant="gradient" colors={colors} loading={buttonsLoading} />
          </View>
        </View>

        {/* Input Fields */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Inputs</Text>
          <View style={styles.inputStack}>
            <Input variant="text" colors={colors} />
            <Input variant="password" colors={colors} />
            <Input variant="textarea" colors={colors} />
          </View>
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Badges</Text>
          <View style={styles.badgeStack}>
            {[
              { label: 'Default', color: colors.border },
              { label: 'Primary', color: colors.primary },
              { label: 'Success', color: colors.success },
              { label: 'Warning', color: colors.warning },
              { label: 'Error', color: colors.error },
            ].map((badge) => (
              <View key={badge.label} style={[styles.badge, { backgroundColor: hexToRgba(badge.color, 0.2), borderWidth: 1, borderColor: badge.color }]}>
                <Text style={{ color: badge.color, fontSize: 12, textTransform: 'uppercase' }}>{badge.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Toggle & Chips */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Chips</Text>
          <View style={styles.chipStack}>
            {['Active', 'Inactive', 'Disabled'].map((chip) => (
              <Chip
                key={chip}
                label={chip}
                selected={chipState[chip]}
                disabled={chip === 'Disabled'}
                colors={colors}
                onPress={() => setChipState({ ...chipState, [chip]: !chipState[chip] })}
              />
            ))}
          </View>
        </View>

        {/* Progress Indicators */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Progress</Text>
          <View style={styles.progressStack}>
            {[0, 25, 55, 100, 120].map((value) => (
              <ProgressBar key={value} value={value} colors={colors} />
            ))}
          </View>
        </View>

        {/* Status Indicators - based on real Prisma enums */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Status</Text>
          {(Object.keys(STATUS_ENUM_COLOR_MAP) as StatusEnumName[]).map((enumName) => (
            <View key={enumName} style={{ marginBottom: 16 }}>
              <Text style={{ color: colors.border, fontSize: 12, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {enumName.replace(/_/g, ' ')}
              </Text>
              <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                {Object.keys(STATUS_ENUM_COLOR_MAP[enumName]).map((value) => (
                  <StatusBadge key={value} enumName={enumName} value={value as never} colors={colors} />
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Card Variants */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Cards</Text>
          <View style={styles.cardStack}>
            <Card
              variant="outlined"
              colors={colors}
              title="Basic content card"
              description="Usato per liste generiche: titolo e descrizione con solo un bordo a separare dallo sfondo."
            />
            <Card
              variant="filled"
              colors={colors}
              title="Solid background card"
              description="Sfondo pieno (qui in gradient) per contenuti in evidenza o call-to-action."
            />
            <Card
              variant="action"
              colors={colors}
              title="Sfida settimanale"
              description="Completa la sfida per guadagnare punti extra"
              actionLabel="Partecipa"
            />
            <Card variant="profile" colors={colors} title="Mario Rossi" profileHandle="@mario.rossi" />
            <Card variant="item" colors={colors} title="Harry Potter" itemCategory="Libri" itemStatus="IN_PROGRESS" />
            <Card
              variant="challenge"
              colors={colors}
              title="Leggi 3 libri"
              challengeTimeframe="Entro fine mese"
              challengeProgress={2}
              challengeGoal={3}
            />
            <Card
              variant="notification"
              colors={colors}
              title="Nuova sfida disponibile"
              notificationBody="Il tuo gruppo ha creato una nuova sfida"
              notificationTime="2 ore fa"
              notificationUnread
            />
          </View>
        </View>

        {/* Accent Examples */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Accent</Text>
          <View style={{ gap: 12 }}>
            {/* Premium/locked feature */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: hexToRgba(colors.accent, 0.4), backgroundColor: hexToRgba(colors.accent, 0.1) }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: hexToRgba(colors.accent, 0.2), alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={16} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.textColor, fontWeight: '700', fontSize: 14 }}>Nascondi item agli amici</Text>
                <Text style={{ color: colors.textColor, fontSize: 12, opacity: 0.7 }}>Funzione riservata agli utenti Premium</Text>
              </View>
              <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: colors.accent }}>
                <Text style={{ color: colors.background, fontSize: 11, fontWeight: '700' }}>PRO</Text>
              </View>
            </View>

            {/* "New" indicator on notification */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent }} />
              <Text style={{ color: colors.textColor, fontSize: 14, flex: 1 }}>Nuova sfida di gruppo creata</Text>
              <Text style={{ color: colors.accent, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>Nuovo</Text>
            </View>

            {/* Streak indicator */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Flame size={20} color={colors.accent} />
              <Text style={{ color: colors.textColor, fontSize: 14, fontWeight: '600' }}>7 giorni di streak</Text>
            </View>
          </View>
        </View>

        {/* Alert Messages */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Alerts</Text>
          <View style={styles.alertStack}>
            {[
              { type: 'Success', color: colors.success, bg: hexToRgba(colors.success, 0.1) },
              { type: 'Warning', color: colors.warning, bg: hexToRgba(colors.warning, 0.1) },
              { type: 'Error', color: colors.error, bg: hexToRgba(colors.error, 0.1) },
              { type: 'Info', color: colors.info, bg: hexToRgba(colors.info, 0.1) },
            ].map((alert) => (
              <View key={alert.type} style={[styles.alert, { backgroundColor: alert.bg, borderColor: alert.color }]}>
                <Text style={{ color: alert.color, fontWeight: '700', fontSize: 15, marginBottom: 2 }}>
                  {alert.type}
                </Text>
                <Text style={{ color: colors.textColor, fontSize: 14, opacity: 0.85 }}>Alert message here</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Checkboxes & Radio Buttons */}
        <View style={[styles.section, { flexDirection: 'row', gap: 32 }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Checkboxes</Text>
            <View style={styles.checkboxStack}>
              {['Unchecked', 'Checked', 'Indeterminate'].map((state) => {
                const isChecked = checkboxState[state];
                return (
                  <Pressable
                    key={state}
                    onPress={() => setCheckboxState({ ...checkboxState, [state]: !isChecked })}
                    style={styles.checkboxItem}
                  >
                    <View style={[styles.checkbox, { backgroundColor: 'transparent', borderColor: colors.border, borderWidth: 1.5, overflow: 'hidden' }]}>
                      <LinearGradient
                        colors={[colors.secondary, colors.secondaryGradient]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                          StyleSheet.absoluteFill,
                          { alignItems: 'center', justifyContent: 'center', opacity: isChecked ? 1 : 0 },
                          Platform.OS === 'web' ? ({ transitionProperty: 'opacity, transform', transitionDuration: '150ms' } as ViewStyle) : {},
                          { transform: [{ scale: isChecked ? 1 : 0.5 }] },
                        ]}
                      >
                        <Check size={14} color={colors.textColor} strokeWidth={3} />
                      </LinearGradient>
                    </View>
                    <Text style={{ color: colors.textColor, fontSize: 14 }}>{state}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Radio Buttons</Text>
            <View style={styles.radioStack}>
              {['Option A', 'Option B', 'Option C'].map((option) => {
                const isSelected = radioState === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => setRadioState(option)}
                    style={styles.radioItem}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        {
                          borderColor: isSelected ? colors.primary : colors.border,
                          borderWidth: 1.5,
                          ...(Platform.OS === 'web' ? ({ transitionProperty: 'border-color', transitionDuration: '150ms' } as ViewStyle) : {}),
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={[colors.secondary, colors.secondaryGradient]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                          styles.radioInner,
                          { opacity: isSelected ? 1 : 0, transform: [{ scale: isSelected ? 1 : 0.3 }] },
                          Platform.OS === 'web' ? ({ transitionProperty: 'opacity, transform', transitionDuration: '150ms' } as ViewStyle) : {},
                        ]}
                      />
                    </View>
                    <Text style={{ color: colors.textColor, fontSize: 14 }}>{option}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* Toggles/Switches */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Switches</Text>
          <View style={styles.toggleStack}>
            {['true', 'false'].map((key) => {
              const isActive = toggleState[key];
              return (
                <Pressable
                  key={key}
                  onPress={() => setToggleState({ ...toggleState, [key]: !isActive })}
                  style={{ borderRadius: 14, overflow: 'hidden' }}
                >
                  <View
                    style={[
                      styles.toggle,
                      {
                        backgroundColor: isActive ? colors.primary : colors.foreground,
                        borderColor: isActive ? colors.primary : colors.border,
                      },
                      Platform.OS === 'web' ? ({ transitionProperty: 'background-color, border-color', transitionDuration: '150ms' } as ViewStyle) : {},
                    ]}
                  >
                    <View
                      style={[
                        styles.toggleThumb,
                        { left: isActive ? 22 : 2, backgroundColor: isActive ? colors.foreground : colors.border },
                        Platform.OS === 'web' ? ({ transitionProperty: 'left, background-color', transitionDuration: '150ms' } as ViewStyle) : {},
                      ]}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Tags - basati sul model Tag (name + color personalizzato) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Tags</Text>
          <View style={styles.tagStack}>
            {[
              { name: 'Romance', color: colors.extraColors.one, useIcon: true },
              { name: 'Sci-Fi', color: colors.extraColors.three },
              { name: 'Classici', color: colors.extraColors.five, useIcon: true },
              { name: 'Da rileggere', color: colors.extraColors.seven },
            ].map((tag) => (
              <TagLabel key={tag.name} name={tag.name} color={tag.color} textColor={colors.textColor} useIcon={tag.useIcon} />
            ))}
          </View>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Links</Text>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            {[
              { label: 'Vedi profilo', color: colors.primary },
              { label: 'Gestisci gruppo', color: colors.secondary },
            ].map((link) => (
              <Pressable key={link.label} onPress={() => { }}>
                {({ pressed }) => (
                  <Text
                    style={{
                      color: link.color,
                      fontSize: 14,
                      fontWeight: '600',
                      textDecorationLine: 'underline',
                      opacity: pressed ? 0.5 : 1,
                    }}
                  >
                    {link.label}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Spinners/Loaders */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Loaders</Text>
          <View style={styles.loaderStack}>
            {[colors.primary, colors.secondary, colors.success].map((color) => (
              <Spinner key={color} color={color} track={hexToRgba(color, 0.2)} />
            ))}
          </View>
        </View>

        {/* Avatars */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Avatars</Text>
          <View style={styles.avatarStack}>
            {[
              { initials: 'MR', color: colors.primary },
              { initials: 'GB', color: colors.secondary },
              { initials: 'FL', color: colors.success },
            ].map((avatar) => (
              <View key={avatar.initials} style={[styles.avatar, { backgroundColor: avatar.color }]}>
                <Text style={{ color: colors.textColor, fontWeight: '700', fontSize: 13 }}>{avatar.initials}</Text>
              </View>
            ))}
            <View style={[styles.avatar, { backgroundColor: hexToRgba(colors.border, 0.3) }]}>
              <Text style={{ color: colors.textColor, fontWeight: '700', fontSize: 13 }}>+4</Text>
            </View>
          </View>
        </View>

        {/* Dividers */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Dividers</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={{ color: colors.border, textAlign: 'center', marginVertical: 12 }}>Or</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>

        {/* Tabs */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Tabs</Text>
          <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
            {['Tab 1', 'Tab 2', 'Tab 3'].map((tab, idx) => (
              <Pressable
                key={tab}
                onPress={() => setCurrentTabIdx(idx)}
                style={[
                  styles.tabItem,
                  {
                    borderBottomColor: currentTabIdx === idx ? colors.primary : 'transparent',
                    borderBottomWidth: 2,
                  },
                ]}
              >
                <Text
                  style={{
                    color: currentTabIdx === idx ? colors.primary : colors.border,
                    fontSize: 14,
                    fontWeight: '500',
                  }}
                >
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Pagination */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Pagination</Text>
          <View style={styles.paginationStack}>
            {[1, 2, 3, 4, 5].map((page) => (
              <Pressable
                key={page}
                onPress={() => setCurrentPage(page)}
                style={[
                  styles.paginationItem,
                  {
                    backgroundColor: currentPage === page ? colors.primary : colors.foreground,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={{ color: currentPage === page ? colors.foreground : colors.textColor, fontWeight: '600' }}>
                  {page}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Rating/Stars */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Rating</Text>
          <View style={styles.ratingStack}>
            {[1, 2, 3, 4, 5].map((star) => (
              <RatingStar
                key={star}
                active={star <= rating}
                color={colors.warning}
                inactiveColor={colors.border}
                onPress={() => setRating(star)}
              />
            ))}
          </View>
        </View>

        {/* Empty State */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Empty State</Text>
          <View style={[styles.emptyState, { borderColor: hexToRgba(colors.border, 0.5), borderStyle: 'dashed' }]}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: hexToRgba(colors.primary, 0.12),
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}
            >
              <Inbox size={24} color={colors.primary} strokeWidth={1.75} />
            </View>
            <Text style={{ color: colors.textColor, fontWeight: '700', fontSize: 18, marginBottom: 4 }}>Nothing here</Text>
            <Text style={{ color: colors.textColor, fontSize: 15, opacity: 0.65 }}>No items to display</Text>
          </View>
        </View>

        {/* Skeleton Loaders */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Skeleton</Text>
          <View style={styles.skeletonStack}>
            <SkeletonLine colors={colors} />
            <SkeletonLine colors={colors} width="80%" />
            <SkeletonLine colors={colors} width="60%" />
          </View>
        </View>

        {/* Filters */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Filtri</Text>
          <FilterButton colors={colors} active={filterSelected.length > 0} onPress={() => setFilterSheetOpen(true)} />
        </View>

        {/* Copied Components from Auth */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Auth Components</Text>

          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 12, color: colors.border, marginBottom: 12 }}>Dice Logo</Text>
            <View style={{ alignItems: 'center' }}>
              <DiceLogoCopy />
            </View>
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 12, color: colors.border, marginBottom: 8 }}>Feature Row</Text>
            <FeatureRowCopy
              Icon={Zap}
              tint={colors.primary}
              gradient={[colors.primary, colors.secondary]}
              title="Feature Example"
              subtitle="This is a feature row component"
              colorScheme={colorScheme}
            />
          </View>
        </View>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            { backgroundColor: colors.foreground, borderTopColor: colors.border },
          ]}
        >
          <Text style={[styles.footerText, { color: colors.textColor }]}>Colors Showcase</Text>
          <Text style={[styles.footerSubtext, { color: colors.border }]}>Self-contained design system</Text>
        </View>
      </ScrollView>

      {/* Bottom Navbar */}
      <NavBar colorScheme={colorScheme} isDark={isDark} setIsDark={setIsDark} activeTab={activeTab} toggleTab={toggleTab} />

      {/* Filter Bottom Sheet - montata dopo la navbar per stare sopra (la navbar ha un blur che sfoca ciò che sta dietro) */}
      <FilterBottomSheet
        colors={colors}
        visible={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        groups={FILTER_GROUPS}
        selected={filterSelected}
        onToggle={toggleFilterValue}
      />
    </SafeAreaView>
  );
}
