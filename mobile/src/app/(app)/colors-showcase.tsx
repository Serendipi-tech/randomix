import { useEffect, useRef, useState } from 'react';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Animated, Easing, Image, Keyboard, Platform, ScrollView, StyleSheet, Text, TextInput, View, Pressable, useWindowDimensions, type LayoutChangeEvent, type TextStyle, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Stop, Circle, Path } from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';
import { Asset } from 'expo-asset';
import { Bell, BookOpen, Check, ChevronLeft, ChevronRight, Eye, EyeOff, Filter, Film, Flame, Gamepad2, Home, Image as ImageIcon, Inbox, LayoutGrid, Lock, Moon, Pencil, ShieldAlert, Star, Sun, Tag, Users, X, Zap } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { useDominantColor } from '@/utils/useDominantColor';
import { styles } from './colors-showcase.styles';

const AVATAR_FOX = require('../../../assets/images/showcase-avatars/fox.png');
const AVATAR_PANDA = require('../../../assets/images/showcase-avatars/panda.png');
const AVATAR_OWL = require('../../../assets/images/showcase-avatars/owl.png');
const AVATAR_URIS = { fox: Asset.fromModule(AVATAR_FOX).uri, panda: Asset.fromModule(AVATAR_PANDA).uri, owl: Asset.fromModule(AVATAR_OWL).uri };

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
      <Pressable onPress={() => setOpen((v) => !v)} hitSlop={12}>
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
          <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={13}>
            {showPassword ? (
              <EyeOff size={18} color={colors.disabled} />
            ) : (
              <Eye size={18} color={colors.disabled} />
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
        <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
          <Text style={{ color: colors.textColor, fontSize: 17, fontWeight: '700' }}>Filtri</Text>
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
          {filteredGroups.length === 0 && <Text style={{ color: colors.disabled, fontSize: 14, paddingHorizontal: 16, paddingVertical: 12 }}>Nessun risultato</Text>}
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

function SectionLabel({ colors, children }: { colors: typeof ShowcaseColors.light | typeof ShowcaseColors.dark; children: string }) {
  return (
    <Text style={{ color: colors.textColor, opacity: 0.55, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {children}
    </Text>
  );
}

type ItemDetailData = {
  imageUri?: string;
  name: string;
  category?: string;
  description?: string; // Item.description: generale, da API in futuro
  userDescription?: string; // User_Item.description: personale
  note?: string;
  status?: keyof (typeof STATUS_ENUM_COLOR_MAP)['STATUS_COMPLETION'];
  ratingValue?: number;
  ratingNote?: string;
  tags?: Array<{ name: string; color: string }>;
  completedAt?: string;
};

function ItemDetailBottomSheet({
  colors,
  visible,
  onClose,
  item,
  onRatingChange,
  onStatusChange,
  onEditPress,
  onRemoveTag,
  onAddTag,
}: {
  colors: typeof ShowcaseColors.light | typeof ShowcaseColors.dark;
  visible: boolean;
  onClose: () => void;
  item: ItemDetailData;
  onRatingChange?: (value: number) => void;
  onStatusChange?: (status: keyof (typeof STATUS_ENUM_COLOR_MAP)['STATUS_COMPLETION']) => void;
  onEditPress?: () => void;
  onRemoveTag?: (name: string) => void;
  onAddTag?: () => void;
}) {
  const { height: screenHeight } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(translateY, { toValue: 0, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }).start();
    } else {
      Animated.timing(translateY, { toValue: screenHeight, duration: 220, easing: Easing.in(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }).start(() => {
        setMounted(false);
      });
    }
  }, [visible]);

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
          // niente "transform": su web forza il browser a promuovere il layer a compositing GPU,
          // che a DPI frazionarie (comune su Windows) sfoca il testo anche a riposo. marginBottom
          // ottiene lo stesso slide-in restando in normale flusso di layout.
          marginBottom: Animated.multiply(translateY, -1),
        }}
      >
        <View
          style={{
            maxHeight: screenHeight * 0.92,
            borderRadius: 20,
            backgroundColor: colors.foreground,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
            boxShadow: `0px -8px 24px ${hexToRgba(colors.shadow, 0.3)}`,
          }}
        >
          <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 6 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: hexToRgba(colors.border, 0.6) }} />
          </View>
          <ScrollView
            style={[{ flexGrow: 0 }, Platform.OS === 'web' ? ({ scrollbarWidth: 'none' } as any) : {}]}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ padding: 16, gap: 18 }}>
              {/* Header: copertina in stile "book cover" + titolo, allineati in alto */}
              <View style={{ flexDirection: 'row', gap: 14 }}>
                {item.imageUri && (
                  <Image source={{ uri: item.imageUri }} style={{ width: 92, height: 122, borderRadius: 10 }} resizeMode="cover" />
                )}
                <View style={{ flex: 1, gap: 6, paddingTop: 2 }}>
                  {item.category && (
                    <Text style={{ color: colors.textColor, opacity: 0.55, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {item.category}
                    </Text>
                  )}
                  <Text style={{ color: colors.textColor, fontWeight: '700', fontSize: 20, lineHeight: 25 }} numberOfLines={3}>
                    {item.name}
                  </Text>
                </View>
              </View>

              {/* Stato: segmented control, un unico controllo invece di chip sparsi */}
              <View style={{ gap: 6 }}>
                <SectionLabel colors={colors}>Stato</SectionLabel>
                <View style={{ flexDirection: 'row', borderRadius: 10, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
                  {(Object.keys(STATUS_ENUM_COLOR_MAP.STATUS_COMPLETION) as Array<keyof (typeof STATUS_ENUM_COLOR_MAP)['STATUS_COMPLETION']>).map((statusKey, i) => {
                    const isActive = item.status === statusKey;
                    const statusColor = colors[STATUS_ENUM_COLOR_MAP.STATUS_COMPLETION[statusKey]];
                    return (
                      <Pressable
                        key={statusKey}
                        onPress={() => onStatusChange?.(statusKey)}
                        style={{
                          flex: 1,
                          paddingVertical: 9,
                          alignItems: 'center',
                          borderLeftWidth: i > 0 ? 1 : 0,
                          borderLeftColor: colors.border,
                          backgroundColor: isActive ? hexToRgba(statusColor, 0.15) : 'transparent',
                        }}
                      >
                        <Text style={{ color: isActive ? statusColor : colors.textColor, fontSize: 12, fontWeight: '600', textAlign: 'center' }}>
                          {statusKey.replace(/_/g, ' ')}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {(item.tags?.length || onAddTag) && (
                <View style={{ gap: 6 }}>
                  <SectionLabel colors={colors}>Tag</SectionLabel>
                  <TagOverflowRow tags={item.tags ?? []} colors={colors} textColor={colors.textColor} expandable onRemoveTag={onRemoveTag} onAddTag={onAddTag} />
                </View>
              )}

              {item.description && (
                <View style={{ gap: 4 }}>
                  <SectionLabel colors={colors}>Descrizione</SectionLabel>
                  <Text style={{ color: colors.textColor, fontSize: 14, lineHeight: 20 }}>{item.description}</Text>
                </View>
              )}

              {item.userDescription && (
                <View style={{ gap: 4 }}>
                  <SectionLabel colors={colors}>La tua descrizione</SectionLabel>
                  <Text style={{ color: colors.textColor, fontSize: 14, lineHeight: 20 }}>{item.userDescription}</Text>
                </View>
              )}

              {/* Nota personale: pannello tintato per distinguere visivamente il contenuto editabile dall'utente */}
              <View style={{ gap: 8, backgroundColor: hexToRgba(colors.primary, 0.07), borderRadius: 12, padding: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <SectionLabel colors={colors}>Nota personale</SectionLabel>
                  <Pressable onPress={onEditPress} hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Pencil size={13} color={colors.primary} />
                    <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>Modifica</Text>
                  </Pressable>
                </View>
                <Text style={{ color: colors.textColor, fontSize: 14, lineHeight: 20, opacity: item.note ? 1 : 0.5, fontStyle: item.note ? 'normal' : 'italic' }}>
                  {item.note || 'Nessuna nota aggiunta'}
                </Text>
              </View>

              {item.completedAt && (
                <Text style={{ color: colors.textColor, fontSize: 12, opacity: 0.5 }}>Completato il {item.completedAt}</Text>
              )}

              {/* Il tuo rating: sempre l'ultimo blocco, in evidenza — si può inserire/modificare ma mai eliminare */}
              <View
                style={{
                  gap: 10,
                  borderWidth: 1,
                  borderColor: hexToRgba(colors.warning, 0.35),
                  backgroundColor: hexToRgba(colors.warning, 0.08),
                  borderRadius: 14,
                  padding: 14,
                  alignItems: 'center',
                }}
              >
                <SectionLabel colors={colors}>Il tuo rating</SectionLabel>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Pressable key={n} onPress={() => onRatingChange?.(n)} hitSlop={6}>
                      <Star
                        size={30}
                        color={colors.warning}
                        fill={n <= Math.round(item.ratingValue ?? 0) ? colors.warning : colors.border}
                        strokeWidth={0}
                      />
                    </Pressable>
                  ))}
                </View>
                <Text style={{ color: colors.textColor, fontSize: 15, fontWeight: '700' }}>
                  {item.ratingValue !== undefined ? item.ratingValue.toFixed(1) : 'Tocca per valutare'}
                </Text>
                {item.ratingNote && (
                  <Text style={{ color: colors.textColor, fontSize: 14, lineHeight: 20, fontStyle: 'italic', textAlign: 'center' }}>
                    “{item.ratingNote}”
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
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
    <Pressable onPress={onPress} hitSlop={8}>
      <View style={{ width: 32, height: 32 }}>
        <Text style={{ position: 'absolute', color: inactiveColor, fontSize: 32 }}>★</Text>
        <Animated.View
          style={{
            position: 'absolute',
            overflow: 'hidden',
            height: 40,
            width: fillAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          }}
        >
          <Text style={{ color, fontSize: 32 }}>★</Text>
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

function ImageAvatar({ uri, name, fallbackColor, textColor }: { uri: string; name: string; fallbackColor: string; textColor: string }) {
  const ringColor = useDominantColor(uri, fallbackColor);

  return (
    <View style={styles.avatarItem}>
      <View style={[styles.avatarRing, { borderColor: ringColor }]}>
        <Image source={{ uri }} style={styles.avatar} />
      </View>
      <Text style={[styles.avatarName, { color: textColor }]} numberOfLines={1} ellipsizeMode="tail">
        {name}
      </Text>
    </View>
  );
}

const TAG_OVERFLOW_GAP = 6;
const TAG_OVERFLOW_BADGE_WIDTH = 34;

function TagOverflowRow({
  tags: unsortedTags,
  textColor,
  colors,
  expandable,
  onRemoveTag,
  onAddTag,
}: {
  tags: Array<{ name: string; color: string }>;
  textColor: string;
  colors: typeof ShowcaseColors.light | typeof ShowcaseColors.dark;
  expandable?: boolean;
  onRemoveTag?: (name: string) => void;
  onAddTag?: () => void;
}) {
  const tags = [...unsortedTags].sort((a, b) => a.name.length - b.name.length);
  const [containerWidth, setContainerWidth] = useState(0);
  const [measuredWidths, setMeasuredWidths] = useState<Record<string, number>>({});
  const [expanded, setExpanded] = useState(false);

  const handleMeasure = (name: string, width: number) => {
    setMeasuredWidths((prev) => (prev[name] === width ? prev : { ...prev, [name]: width }));
  };

  const allMeasured = containerWidth > 0 && tags.every((tag) => measuredWidths[tag.name] !== undefined);

  let visibleTags = tags;
  let overflowCount = 0;

  if (allMeasured && !expanded) {
    let used = 0;
    let count = 0;
    for (let i = 0; i < tags.length; i++) {
      const width = measuredWidths[tags[i].name];
      const next = used + (count > 0 ? TAG_OVERFLOW_GAP : 0) + width;
      if (next > containerWidth) break;
      used = next;
      count++;
    }
    if (count < tags.length) {
      while (count > 0) {
        const usedUpToCount = tags.slice(0, count).reduce((sum, tag, i) => sum + measuredWidths[tag.name] + (i > 0 ? TAG_OVERFLOW_GAP : 0), 0);
        if (usedUpToCount + TAG_OVERFLOW_GAP + TAG_OVERFLOW_BADGE_WIDTH <= containerWidth) break;
        count--;
      }
    }
    visibleTags = tags.slice(0, count);
    overflowCount = tags.length - count;
  }

  return (
    <View onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      <View style={{ position: 'absolute', opacity: 0 }} pointerEvents="none">
        <View style={{ flexDirection: 'row' }}>
          {tags.map((tag) => (
            <View key={tag.name} onLayout={(e) => handleMeasure(tag.name, e.nativeEvent.layout.width)}>
              <TagLabel name={tag.name} color={tag.color} textColor={textColor} compact />
            </View>
          ))}
        </View>
      </View>
      {allMeasured && (
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: expanded ? 'wrap' : 'nowrap', gap: TAG_OVERFLOW_GAP }}>
          {visibleTags.map((tag) => (
            <TagLabel
              key={tag.name}
              name={tag.name}
              color={tag.color}
              textColor={textColor}
              compact
              onRemove={onRemoveTag ? () => onRemoveTag(tag.name) : undefined}
            />
          ))}
          {overflowCount > 0 &&
            (expandable ? (
              <Pressable
                onPress={() => setExpanded(true)}
                style={{ paddingVertical: 5, paddingHorizontal: 8, borderRadius: 6, backgroundColor: hexToRgba(colors.border, 0.2) }}
              >
                <Text style={{ color: textColor, fontSize: 12, fontWeight: '600' }}>+{overflowCount}</Text>
              </Pressable>
            ) : (
              <View style={{ paddingVertical: 5, paddingHorizontal: 8, borderRadius: 6, backgroundColor: hexToRgba(colors.border, 0.2) }}>
                <Text style={{ color: textColor, fontSize: 12, fontWeight: '600' }}>+{overflowCount}</Text>
              </View>
            ))}
          {expanded && (
            <Pressable onPress={() => setExpanded(false)} hitSlop={6}>
              <Text style={{ color: textColor, fontSize: 12, fontWeight: '600', opacity: 0.6 }}>Mostra meno</Text>
            </Pressable>
          )}
          {onAddTag && (
            <Pressable
              onPress={onAddTag}
              style={{ paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, borderWidth: 1, borderColor: hexToRgba(textColor, 0.3), borderStyle: 'dashed' }}
            >
              <Text style={{ color: textColor, fontSize: 11, fontWeight: '700' }}>+ Tag</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

function TagLabel({ name, color, textColor, compact, onRemove }: { name: string; color: string; textColor: string; compact?: boolean; onRemove?: () => void }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: compact ? 4 : 6,
        paddingVertical: compact ? 3 : 5,
        paddingHorizontal: compact ? 7 : 10,
        borderRadius: 6,
        backgroundColor: hexToRgba(color, 0.15),
      }}
    >
      <Tag size={compact ? 11 : 14} color={color} strokeWidth={2.5} />
      <Text
        style={{
          color: textColor,
          fontSize: compact ? 11 : 14,
          fontWeight: '600',
          textTransform: compact ? 'uppercase' : 'none',
          letterSpacing: compact ? 0.3 : 0,
        }}
      >
        {name}
      </Text>
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={8}>
          <X size={compact ? 11 : 13} color={textColor} strokeWidth={2.5} />
        </Pressable>
      )}
    </View>
  );
}

type CardVariant = 'outlined' | 'filled' | 'action' | 'profile' | 'item' | 'challenge' | 'notification' | 'list';

type CardProps = {
  variant: CardVariant;
  colors: typeof ShowcaseColors.light | typeof ShowcaseColors.dark;
  title: string;
  description?: string;
  actionLabel?: string;
  profileHandle?: string;
  profileImageUri?: string;
  profileGroupsInCommon?: number;
  itemCategory?: string;
  itemStatus?: keyof (typeof STATUS_ENUM_COLOR_MAP)['STATUS_COMPLETION'];
  itemShowImage?: boolean;
  itemImageUri?: string;
  itemRating?: number;
  itemTags?: Array<{ name: string; color: string }>;
  listCategory?: string;
  listIcon?: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  listColor?: string;
  listItemsCount?: number;
  listMaxItems?: number;
  listCompleted?: number;
  listInProgress?: number;
  listNotStarted?: number;
  onPress?: () => void;
  challengeProgress?: number;
  challengeGoal?: number;
  challengeTimeframe?: string;
  challengeGroupName?: string;
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
  profileImageUri,
  profileGroupsInCommon,
  itemCategory,
  itemStatus,
  itemShowImage = true,
  itemImageUri,
  itemRating,
  itemTags,
  listCategory,
  listIcon,
  listColor,
  listItemsCount,
  listMaxItems,
  listCompleted,
  listInProgress,
  listNotStarted,
  onPress,
  challengeProgress,
  challengeGoal,
  challengeTimeframe,
  challengeGroupName,
  notificationBody,
  notificationTime,
  notificationUnread,
}: CardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const profileDominantColor = useDominantColor(profileImageUri ?? '', colors.primary);

  if (variant === 'item') {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: colors.foreground,
            borderColor: colors.border,
            flexDirection: 'row',
            gap: 12,
            padding: 0,
            overflow: 'hidden',
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: 12, paddingLeft: 16, paddingRight: itemShowImage ? 0 : 16 }}>
          <View style={{ gap: 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              {itemCategory && (
                <Text style={{ color: colors.textColor, fontSize: 14, opacity: 0.7, flex: 1 }}>{itemCategory}</Text>
              )}
              {itemStatus && <StatusBadge enumName="STATUS_COMPLETION" value={itemStatus} colors={colors} />}
            </View>
            <View style={{ height: 44, justifyContent: 'center' }}>
              <Text style={{ color: colors.textColor, fontWeight: '700', fontSize: 17, lineHeight: 22 }} numberOfLines={2} ellipsizeMode="tail">
                {title}
              </Text>
            </View>
          </View>
          {(itemTags?.length || itemRating !== undefined) && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
              {itemTags && itemTags.length > 0 && (
                <View style={{ flex: 1 }}>
                  <TagOverflowRow tags={itemTags} colors={colors} textColor={colors.textColor} />
                </View>
              )}
              {itemRating !== undefined && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 14, height: 14 }}>
                    <Star size={14} color={colors.border} fill={colors.border} strokeWidth={0} style={{ position: 'absolute' }} />
                    <View style={{ position: 'absolute', overflow: 'hidden', width: `${Math.min(itemRating / 5, 1) * 100}%`, height: 14 }}>
                      <Star size={14} color={colors.warning} fill={colors.warning} strokeWidth={0} />
                    </View>
                  </View>
                  <Text style={{ color: colors.textColor, fontSize: 14, fontWeight: '600' }}>{itemRating.toFixed(1)}</Text>
                </View>
              )}
            </View>
          )}
        </View>
        {itemShowImage && (
          <View style={{ width: 72, backgroundColor: hexToRgba(colors.primary, 0.15), alignItems: 'center', justifyContent: 'center' }}>
            {itemImageUri ? (
              <Image source={{ uri: itemImageUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            ) : (
              <ImageIcon size={22} color={colors.primary} />
            )}
          </View>
        )}
      </Pressable>
    );
  }

  if (variant === 'challenge') {
    const progress = challengeProgress ?? 0;
    const goal = challengeGoal ?? 1;
    const pct = Math.round((progress / goal) * 100);
    return (
      <LinearGradient
        colors={[colors.secondary, colors.secondaryGradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 12, padding: 2 }}
      >
        <View style={{ borderRadius: 10, backgroundColor: colors.foreground, padding: 16 }}>
          {challengeGroupName && (
            <Text style={{ color: colors.secondary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 }}>
              {challengeGroupName}
            </Text>
          )}
          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={{ color: colors.textColor, fontWeight: '700', fontSize: 16, marginBottom: 2 }}>{title}</Text>
              <StatusBadge enumName="STATUS_CHALLENGE" value="IN_PROGRESS" colors={colors} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {challengeTimeframe && (
                <Text style={{ color: colors.textColor, fontSize: 12, opacity: 0.7 }}>{challengeTimeframe}</Text>
              )}
              <Text style={{ color: colors.textColor, fontSize: 12, opacity: 0.7 }}>
                {progress} / {goal} completati
              </Text>
            </View>
          </View>
          <ProgressBar value={pct} colors={colors} />
        </View>
        <Pressable
          onPress={() => setIsFavorite((v) => !v)}
          hitSlop={8}
          style={{ position: 'absolute', top: -10, right: -10 }}
        >
          <Star size={28} color={colors.warning} fill={isFavorite ? colors.warning : colors.background} strokeWidth={2} />
        </Pressable>
      </LinearGradient>
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
          {notificationBody && <Text style={{ color: colors.textColor, fontSize: 14, opacity: 0.8 }}>{notificationBody}</Text>}
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

  if (variant === 'list') {
    const ListIcon = listIcon;
    const accentColor = listColor ?? colors.primary;
    const LIST_CARD_HEIGHT = 66;
    return (
      <View
        style={[
          styles.card,
          { backgroundColor: colors.foreground, borderColor: accentColor, borderWidth: 1, height: LIST_CARD_HEIGHT, flexDirection: 'row', alignItems: 'stretch', gap: 12, padding: 0, overflow: 'hidden' },
        ]}
      >
        <LinearGradient
          colors={['transparent', hexToRgba(accentColor, 0.25)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={{ width: LIST_CARD_HEIGHT, height: LIST_CARD_HEIGHT, alignItems: 'center', justifyContent: 'center' }}>
          {ListIcon && (
            <View style={{ transform: [{ rotate: '-30deg' }], opacity: 0.5 }}>
              <ListIcon size={LIST_CARD_HEIGHT * 1.15} color={accentColor} strokeWidth={1.5} />
            </View>
          )}
        </View>
        <View style={{ flex: 1, paddingTop: 16, paddingBottom: 16, paddingLeft: 5, paddingRight: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <View style={{ flex: 1, gap: 2, marginTop: -3 }}>
              {listCategory && <Text style={{ color: colors.textColor, fontSize: 12, lineHeight: 14, opacity: 0.7 }}>{listCategory}</Text>}
              <Text style={{ color: colors.textColor, fontWeight: '700', fontSize: 16, lineHeight: 18 }}>{title}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {listItemsCount !== undefined && listMaxItems !== undefined && (
                <Text style={{ color: colors.textColor, fontSize: 13, lineHeight: 16, fontWeight: '600', opacity: 0.7 }}>
                  {listItemsCount}/{listMaxItems}
                </Text>
              )}
              <Pressable
                onPress={onPress}
                hitSlop={8}
                style={{ width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.foreground }}
              >
                <ChevronRight size={18} color={accentColor} />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (variant === 'profile') {
    return (
      <View style={[styles.card, { backgroundColor: colors.foreground, borderColor: profileImageUri ? profileDominantColor : colors.border, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
        {profileImageUri ? (
          <Image source={{ uri: profileImageUri }} style={{ width: 38, height: 38, borderRadius: 19 }} resizeMode="cover" />
        ) : (
          <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Users size={18} color={colors.textColor} />
          </View>
        )}
        <View style={{ flex: 1, gap: 1 }}>
          {profileHandle && <Text style={{ color: colors.textColor, fontWeight: '700', fontSize: 14 }}>{profileHandle}</Text>}
          {profileGroupsInCommon !== undefined && (
            <Text style={{ color: colors.textColor, fontSize: 12, opacity: 0.7 }}>
              {profileGroupsInCommon} grupp{profileGroupsInCommon === 1 ? 'o' : 'i'} in comune
            </Text>
          )}
        </View>
        <Pressable
          onPress={onPress}
          hitSlop={8}
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: hexToRgba(profileImageUri ? profileDominantColor : colors.primary, 0.12),
          }}
        >
          <ChevronRight size={18} color={profileImageUri ? profileDominantColor : colors.primary} />
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

function HomeButtonComp({ colors, isActive, onPress }: { colors: typeof ShowcaseColors.light | typeof ShowcaseColors.dark; isActive: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.homeButton, { backgroundColor: isActive ? undefined : colors.primary }]} hitSlop={6} onPress={onPress}>
      {isActive && (
        <LinearGradient
          colors={[colors.secondary, colors.secondaryGradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={styles.homeIconStack}>
        <Home size={24} color={colors.textColor} strokeWidth={2.5} />
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
          <Pressable onPress={onBack} hitSlop={10}>
            <ChevronLeft size={24} color={colors.textColor} />
          </Pressable>
        )}
      </View>
      {subtitle && <Text style={styles.pageHeaderSubtitle}>{subtitle}</Text>}
    </View>
  );
}

function NavBar({ colorScheme, isDark, setIsDark, activeTab, toggleTab, onHomePress, blurDisabled }: { colorScheme: 'light' | 'dark'; isDark: boolean; setIsDark: (val: boolean) => void; activeTab: 'profile' | 'notifications' | 'friends' | null; toggleTab: (tab: 'profile' | 'notifications' | 'friends') => void; onHomePress: () => void; blurDisabled?: boolean }) {
  const colors = ShowcaseColors[colorScheme];
  const fill =
    colorScheme === 'light'
      ? hexToRgba(colors.primary, 0.2)
      : hexToRgba(colors.primary, 0.2);
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  const mutedColor = colors.textColor;
  const activeColor = colors.secondary;

  // Blur ritagliato a forma navbar: su web clip-path CSS (MaskedView rompe il backdrop-filter),
  // su nativo MaskedView + BlurView
  const wavePath = buildWavePath(width);
  const blurLayer = blurDisabled ? (
    // backdrop-filter (web) sfoca anche i contenuti sovrapposti come le bottomsheet: disattivato quando una è aperta
    <View pointerEvents="none" style={[styles.clip, { width, height: BAR_HEIGHT, backgroundColor: hexToRgba(colors.foreground, 0.85) }]} />
  ) : Platform.OS === 'web' ? (
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
                <Path d={buildWavePath(width)} fill={fill} />
              </Svg>
              <View style={styles.row}>
                <SideTabButton name="profile" isActive={activeTab === 'profile'} onPress={() => toggleTab('profile')} mutedColor={mutedColor} activeColor={activeColor} />
                <SideTabButton name="notifications" isActive={activeTab === 'notifications'} onPress={() => toggleTab('notifications')} mutedColor={mutedColor} activeColor={activeColor} />
                <HomeButtonComp colors={colors} isActive={activeTab === null} onPress={onHomePress} />
                <SideTabButton name="friends" isActive={activeTab === 'friends'} onPress={() => toggleTab('friends')} mutedColor={mutedColor} activeColor={activeColor} />
                <View style={styles.themeToggle}>
                  <Pressable hitSlop={10} onPress={() => setIsDark(!isDark)}>
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
  const colorScheme = isDark ? 'dark' : 'light';
  const colors = ShowcaseColors[colorScheme];
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
  const [itemDetailOpen, setItemDetailOpen] = useState(false);
  const DEMO_TAGS = [
    { name: 'Fantasy', color: colors.extraColors.one },
    { name: 'Avventura', color: colors.extraColors.three },
    { name: 'Magia', color: colors.extraColors.six },
    { name: 'Classici', color: colors.extraColors.five },
    { name: 'Da rileggere', color: colors.extraColors.seven },
    { name: 'Teen', color: colors.extraColors.nine },
  ];
  const ITEM_DETAIL_WITH_IMAGE: ItemDetailData = {
    imageUri: 'https://a.wattpad.com/useravatar/Ga22ia.256.878100.jpg',
    name: 'Harry Potter e il prigioniero di Azkaban',
    category: 'Libri',
    status: 'IN_PROGRESS',
    ratingValue: 4.7,
    ratingNote: 'Il migliore della saga finora: Sirius Black è un personaggio scritto benissimo.',
    description: 'Terzo capitolo della saga: Harry scopre la verità su Sirius Black e affronta i Dissennatori di Azkaban.',
    userDescription: 'La mia copia è quella con la cover illustrata, edizione 2004.',
    note: 'Rileggerlo prima del quarto libro.',
    tags: DEMO_TAGS,
  };
  const ITEM_DETAIL_NO_IMAGE: ItemDetailData = {
    name: 'Harry Potter e il prigioniero di Azkaban',
    category: 'Libri',
    status: 'IN_PROGRESS',
    ratingValue: 4.7,
    ratingNote: 'Il migliore della saga finora: Sirius Black è un personaggio scritto benissimo.',
    description: 'Terzo capitolo della saga: Harry scopre la verità su Sirius Black e affronta i Dissennatori di Azkaban.',
    userDescription: 'La mia copia è quella con la cover illustrata, edizione 2004.',
    note: 'Rileggerlo prima del quarto libro.',
    tags: DEMO_TAGS,
  };
  const [itemDetail, setItemDetail] = useState<ItemDetailData>(ITEM_DETAIL_WITH_IMAGE);

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
            <Card
              variant="profile"
              colors={colors}
              title="mario_rossi"
              profileHandle="mario_rossi"
              profileImageUri={AVATAR_URIS.fox}
              profileGroupsInCommon={3}
              onPress={() => { }}
            />
            <Card
              variant="profile"
              colors={colors}
              title="giulia_bianchi"
              profileHandle="giulia_bianchi"
              profileImageUri={AVATAR_URIS.panda}
              profileGroupsInCommon={1}
              onPress={() => { }}
            />
            <Card
              variant="profile"
              colors={colors}
              title="francesca_luna"
              profileHandle="francesca_luna"
              profileImageUri={AVATAR_URIS.owl}
              profileGroupsInCommon={7}
              onPress={() => { }}
            />
            <Card
              variant="list"
              colors={colors}
              title="Da leggere"
              listCategory="Cultura"
              listIcon={BookOpen}
              listColor={colors.extraColors.three}
              listItemsCount={12}
              listMaxItems={20}
              listCompleted={5}
              listInProgress={3}
              listNotStarted={4}
              onPress={() => { }}
            />
            <Card
              variant="list"
              colors={colors}
              title="Serata film"
              listCategory="Intrattenimento"
              listIcon={Film}
              listColor={colors.extraColors.one}
              listItemsCount={5}
              listMaxItems={10}
              listCompleted={2}
              listInProgress={1}
              listNotStarted={2}
              onPress={() => { }}
            />
            <Card
              variant="list"
              colors={colors}
              title="Backlog videogiochi"
              listCategory="Hobby"
              listIcon={Gamepad2}
              listColor={colors.extraColors.six}
              listItemsCount={8}
              listMaxItems={15}
              listCompleted={3}
              listInProgress={2}
              listNotStarted={3}
              onPress={() => { }}
            />
            <Card
              variant="item"
              colors={colors}
              title="Harry Potter e il prigioniero di Azkaban"
              itemCategory="Libri"
              itemStatus="IN_PROGRESS"
              itemImageUri="https://a.wattpad.com/useravatar/Ga22ia.256.878100.jpg"
              itemRating={4.7}
              itemTags={[
                { name: 'Fantasy', color: colors.extraColors.one },
                { name: 'Avventura', color: colors.extraColors.three },
                { name: 'Magia', color: colors.extraColors.six },
                { name: 'Classici', color: colors.extraColors.five },
                { name: 'Da rileggere', color: colors.extraColors.seven },
                { name: 'Teen', color: colors.extraColors.nine },
              ]}
              onPress={() => { setItemDetail(ITEM_DETAIL_WITH_IMAGE); setItemDetailOpen(true); }}
            />
            <Card
              variant="item"
              colors={colors}
              title="Harry Potter e il prigioniero di Azkaban"
              itemCategory="Libri"
              itemStatus="IN_PROGRESS"
              itemShowImage={false}
              itemRating={4.7}
              itemTags={[
                { name: 'Fantasy', color: colors.extraColors.one },
                { name: 'Avventura', color: colors.extraColors.three },
                { name: 'Magia', color: colors.extraColors.six },
                { name: 'Classici', color: colors.extraColors.five },
                { name: 'Da rileggere', color: colors.extraColors.seven },
                { name: 'Teen', color: colors.extraColors.nine },
              ]}
              onPress={() => { setItemDetail(ITEM_DETAIL_NO_IMAGE); setItemDetailOpen(true); }}
            />
            <Card
              variant="challenge"
              colors={colors}
              title="Leggi 3 libri"
              challengeTimeframe="Entro fine mese"
              challengeProgress={2}
              challengeGoal={3}
            />
            <Card
              variant="challenge"
              colors={colors}
              title="Leggi 3 libri"
              challengeTimeframe="Entro fine mese"
              challengeProgress={2}
              challengeGoal={3}
              challengeGroupName="Lettori Forti"
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
                    hitSlop={4}
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
                    hitSlop={4}
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
                  hitSlop={7}
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
              { name: 'Romance', color: colors.extraColors.one },
              { name: 'Sci-Fi', color: colors.extraColors.three },
              { name: 'Classici', color: colors.extraColors.five },
              { name: 'Da rileggere', color: colors.extraColors.seven },
            ].map((tag) => (
              <TagLabel key={tag.name} name={tag.name} color={tag.color} textColor={colors.textColor} />
            ))}
          </View>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Links</Text>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            {[
              { label: 'Vedi profilo' },
              { label: 'Gestisci gruppo' },
            ].map((link) => (
              <Pressable key={link.label} onPress={() => { }} hitSlop={12} style={{ paddingVertical: 12 }}>
                {({ pressed }) => (
                  <View
                    style={{
                      borderBottomColor: colors.accent,
                      borderBottomWidth: 1.5,
                      opacity: pressed ? 0.5 : 1,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.accent,
                        fontSize: 14,
                        fontWeight: '600',
                      }}
                    >
                      {link.label}
                    </Text>
                  </View>
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
              { uri: AVATAR_URIS.fox, name: 'mario_rossi', fallback: colors.primary },
              { uri: AVATAR_URIS.panda, name: 'giulia_bianchi', fallback: colors.secondary },
              { uri: AVATAR_URIS.owl, name: 'francesca_luna', fallback: colors.success },
            ].map((avatar) => (
              <ImageAvatar key={avatar.name} uri={avatar.uri} name={avatar.name} fallbackColor={avatar.fallback} textColor={colors.textColor} />
            ))}
            <View style={styles.avatarItem}>
              <View style={[styles.avatarRing, { borderColor: hexToRgba(colors.border, 0.5) }]}>
                <View style={[styles.avatar, { backgroundColor: hexToRgba(colors.border, 0.3) }]}>
                  <Text style={{ color: colors.textColor, fontWeight: '700', fontSize: 15 }}>+4</Text>
                </View>
              </View>
              <Text style={[styles.avatarName, { color: colors.border }]} numberOfLines={1}>
                Altri
              </Text>
            </View>
          </View>
        </View>

        {/* Dividers */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Dividers</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={[styles.divider, { flex: 1, width: undefined, backgroundColor: colors.border }]} />
            <Text style={{ color: colors.textColor, fontSize: 13 }}>Or</Text>
            <View style={[styles.divider, { flex: 1, width: undefined, backgroundColor: colors.border }]} />
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Tabs</Text>
          <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
            {['Tab 1', 'Tab 2', 'Tab 3'].map((tab, idx) => (
              <Pressable
                key={tab}
                onPress={() => setCurrentTabIdx(idx)}
                style={({ pressed }) => [
                  styles.tabItem,
                  {
                    borderBottomColor: currentTabIdx === idx ? colors.primary : 'transparent',
                    borderBottomWidth: 2,
                    ...(Platform.OS === 'web' ? ({ transitionProperty: 'border-color', transitionDuration: '150ms' } as ViewStyle) : {}),
                    ...(pressed ? { transform: [{ scale: 0.96 }] } : {}),
                  },
                ]}
              >
                <Text
                  style={{
                    color: currentTabIdx === idx ? colors.primary : colors.textColor,
                    fontSize: 14,
                    fontWeight: '500',
                    ...(Platform.OS === 'web' ? ({ transitionProperty: 'color', transitionDuration: '150ms' } as TextStyle) : {}),
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
                style={({ pressed }) => [
                  styles.paginationItem,
                  {
                    backgroundColor: currentPage === page ? colors.primary : colors.foreground,
                    borderColor: colors.border,
                    ...(Platform.OS === 'web' ? ({ transitionProperty: 'background-color, border-color', transitionDuration: '150ms' } as ViewStyle) : {}),
                    ...(pressed ? { transform: [{ scale: 0.94 }] } : {}),
                  },
                ]}
              >
                <Text
                  style={{
                    color: colors.textColor,
                    fontWeight: '600',
                  }}
                >
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
      <NavBar
        colorScheme={colorScheme}
        isDark={isDark}
        setIsDark={setIsDark}
        activeTab={activeTab}
        toggleTab={toggleTab}
        onHomePress={() => setActiveTab(null)}
        blurDisabled={filterSheetOpen || itemDetailOpen}
      />

      {/* Filter Bottom Sheet - montata dopo la navbar per stare sopra (la navbar ha un blur che sfoca ciò che sta dietro) */}
      <FilterBottomSheet
        colors={colors}
        visible={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        groups={FILTER_GROUPS}
        selected={filterSelected}
        onToggle={toggleFilterValue}
      />

      <ItemDetailBottomSheet
        colors={colors}
        visible={itemDetailOpen}
        onClose={() => setItemDetailOpen(false)}
        item={itemDetail}
        onRatingChange={(value) => setItemDetail((prev) => ({ ...prev, ratingValue: value }))}
        onStatusChange={(status) => setItemDetail((prev) => ({ ...prev, status }))}
        onEditPress={() => { }}
        onRemoveTag={(name) => setItemDetail((prev) => ({ ...prev, tags: prev.tags?.filter((t) => t.name !== name) }))}
        onAddTag={() => {
          const pool = DEMO_TAGS.filter((t) => !itemDetail.tags?.some((existing) => existing.name === t.name));
          if (pool.length === 0) return;
          const next = pool[0];
          setItemDetail((prev) => ({ ...prev, tags: [...(prev.tags ?? []), next] }));
        }}
      />
    </SafeAreaView>
  );
}
