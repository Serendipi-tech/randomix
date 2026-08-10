import type { ComponentType } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'confirm' | 'gradient' | 'soft';

// Altezza unica per ogni variante: i bottoni sono sempre allineati tra loro
const BUTTON_HEIGHT = 48;

// Unione dei due schemi: `Colors[colorScheme]` non è restringibile a un solo scheme (literal `as const`)
type ThemeColors = typeof Colors.light | typeof Colors.dark;

type ButtonProps = {
  variant?: ButtonVariant;
  /** Opzionale: se assente il bottone è icon-only (richiede `icon`). */
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  /** Icona opzionale a sinistra della label, valida per tutte le varianti. */
  icon?: ComponentType<{ size?: number; color?: string }>;
  /** Solo per variant `soft`, alternativa a `icon`: quadretto colorato (per trigger tipo "scegli colore"). */
  swatchColor?: string;
};

type VariantStyle = {
  backgroundColor: string;
  borderWidth: number;
  borderColor?: string;
  textColor: string;
  rippleColor: string;
  fontWeight: '600' | '700';
  isGradient?: boolean;
};

/** In base a `variant` renderizza il tipo di bottone: shell unica, nessun bottone annidato.
 *  `disabled` forza la variante `ghost` e disabilita l'interazione; `loading` mostra uno spinner
 *  mantenendo la variante e blocca l'interazione. */
export function Button({ variant = 'primary', label, onPress, disabled = false, loading = false, icon: Icon, swatchColor }: ButtonProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  // disabled forza sempre l'aspetto ghost, a prescindere dalla variante richiesta
  const effectiveVariant: ButtonVariant = disabled ? 'ghost' : variant;
  const isBlocked = disabled || loading;

  // Transizione del transform solo su web (su nativo la gestisce il feedback pressed)
  const pressTransition: ViewStyle =
    Platform.OS === 'web' ? ({ transitionProperty: 'transform', transitionDuration: '80ms' } as ViewStyle) : {};

  const v = resolveVariant(effectiveVariant, colors);

  if (effectiveVariant === 'soft') {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.softButton,
          pressTransition,
          { backgroundColor: colors.foreground },
          pressed && !isBlocked ? styles.pressed : null,
        ]}
        onPress={onPress}
        disabled={isBlocked}
        android_ripple={{ color: colors.textColor, radius: 8 }}
      >
        {Icon && <Icon size={18} color={colors.textColor} />}
        {swatchColor && <View style={[styles.swatch, { backgroundColor: swatchColor }]} />}
        {label ? <Text style={[styles.softLabel, { color: colors.textColor }]}>{label}</Text> : null}
      </Pressable>
    );
  }

  if (v.isGradient) {
    return (
      <Pressable
        style={({ pressed }) => [styles.button, pressTransition, styles.gradientClip, pressed && !isBlocked ? styles.pressed : null]}
        onPress={onPress}
        disabled={isBlocked}
        android_ripple={{ color: colors.textColor, radius: 8 }}
      >
        <LinearGradient
          colors={[colors.secondary, colors.secondaryGradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <ButtonContent label={label} icon={Icon} color={v.textColor} fontWeight={v.fontWeight} loading={loading} />
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressTransition,
        { backgroundColor: v.backgroundColor, borderWidth: v.borderWidth, borderColor: v.borderColor },
        disabled ? styles.disabled : null,
        pressed && !isBlocked ? styles.pressed : null,
      ]}
      onPress={onPress}
      disabled={isBlocked}
      android_ripple={{ color: v.rippleColor, radius: 8 }}
    >
      <ButtonContent label={label} icon={Icon} color={v.textColor} fontWeight={v.fontWeight} loading={loading} />
    </Pressable>
  );
}

function ButtonContent({
  label,
  color,
  fontWeight,
  loading,
  icon: Icon,
}: {
  label?: string;
  color: string;
  fontWeight: '600' | '700';
  loading: boolean;
  icon?: ComponentType<{ size?: number; color?: string }>;
}) {
  if (loading) {
    return (
      <View style={styles.contentRow}>
        <ActivityIndicator size="small" color={color} />
      </View>
    );
  }

  return (
    <View style={styles.contentRow}>
      {Icon && <Icon size={18} color={color} />}
      {label ? <Text style={[styles.label, { color, fontWeight }]}>{label}</Text> : null}
    </View>
  );
}

/** Mappa variante → colori/bordo, letti dai token del tema (già allineati a ShowcaseColors). */
function resolveVariant(variant: ButtonVariant, colors: ThemeColors): VariantStyle {
  switch (variant) {
    case 'primary':
      return { backgroundColor: colors.primary, borderWidth: 0, textColor: colors.textColor, rippleColor: colors.foreground, fontWeight: '600' };
    case 'secondary':
      return { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary, textColor: colors.primary, rippleColor: colors.primary, fontWeight: '600' };
    case 'ghost':
      return { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border, textColor: colors.border, rippleColor: colors.textColor, fontWeight: '600' };
    case 'destructive':
      return { backgroundColor: hexToRgba(colors.error, 0.2), borderWidth: 1, borderColor: colors.error, textColor: colors.error, rippleColor: colors.error, fontWeight: '700' };
    case 'confirm':
      return { backgroundColor: hexToRgba(colors.success, 0.2), borderWidth: 1, borderColor: colors.success, textColor: colors.success, rippleColor: colors.success, fontWeight: '600' };
    case 'gradient':
      return { backgroundColor: 'transparent', borderWidth: 0, textColor: colors.textColor, rippleColor: colors.textColor, fontWeight: '600', isGradient: true };
    case 'soft':
      // gestita con un render dedicato in Button(), non passa mai da qui
      return { backgroundColor: 'transparent', borderWidth: 0, textColor: colors.textColor, rippleColor: colors.textColor, fontWeight: '600' };
  }
}

const styles = StyleSheet.create({
  button: {
    height: BUTTON_HEIGHT,
    borderRadius: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gradientClip: {
    overflow: 'hidden',
  },
  softButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: BUTTON_HEIGHT,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  softLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  swatch: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
