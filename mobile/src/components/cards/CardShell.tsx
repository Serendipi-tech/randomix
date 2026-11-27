import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { SectionLabel } from '@/components/atoms/SectionLabel';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

type CardShellVariant = 'default' | 'callout' | 'gradient';

const SHELL_RADIUS = 12;

type CardShellProps = {
  children: ReactNode;
  borderColor?: string;
  backgroundColor?: string;
  borderWidth?: number;
  /** `callout`: solo barra accento a sinistra + sfondo tinta derivato da `borderColor`.
   *  `gradient`: bordo sottile a gradiente (non un fill) attorno a un interno a colore piatto normale,
   *  vedi `gradientColors`/`gradientBorderWidth`. */
  variant?: CardShellVariant;
  onPress?: () => void;
  /** Solo per variant `gradient`: coppia di colori del bordo, entrambi opachi (mai un alpha basso: da
   *  stop di gradiente, non da overlay, lascerebbe intravedere lo sfondo dietro la card).
   *  Default: lo stesso gradiente "filled" confermato in colors-showcase (secondary→secondaryGradient). */
  gradientColors?: readonly [string, string];
  /** Solo per variant `gradient`: spessore dell'anello colorato. Default 1.5. */
  gradientBorderWidth?: number;
  /** Solo per variant `gradient`: riempimento interno sfumato (sinistra→destra) invece del colore
   *  piatto. Stesso guscio di RandomizerCard, senza i suoi decori. */
  backgroundGradient?: readonly [string, string];
  /** Raggio degli angoli. Default 12 (SHELL_RADIUS). */
  radius?: number;
  /** Padding interno del contenuto. Default 16 (vale per tutte le varianti). */
  padding?: number;
  /** Titolo opzionale in cima alla card: già stilato (SectionLabel `heading`) e distanziato dal
   *  contenuto, così la spaziatura non va ripetuta da ogni card. */
  title?: string;
  /** Bordo sinistro d'accento, più spesso degli altri tre: col raggio della card il giunto fra i
   *  due spessori si chiude a punta sulle due curve. */
  accentEdgeColor?: string;
  accentEdgeWidth?: number;
};

/** Guscio visivo condiviso da tutte le varianti di Card: bordo, raggio, background e clipping.
 *  Con `onPress` l'intera area diventa cliccabile. */
export function CardShell({
  children,
  borderColor,
  backgroundColor,
  borderWidth,
  variant = 'default',
  onPress,
  gradientColors,
  gradientBorderWidth,
  backgroundGradient,
  radius = SHELL_RADIUS,
  padding,
  title,
  accentEdgeColor,
  accentEdgeWidth,
}: CardShellProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const accent = borderColor ?? colors.border;

  const content = title ? (
    <View style={styles.titledContent}>
      <SectionLabel variant="heading">{title}</SectionLabel>
      {children}
    </View>
  ) : (
    children
  );

  if (variant === 'gradient') {
    const fill = gradientColors ?? ([colors.secondary, colors.secondaryGradient] as const);
    const ringWidth = gradientBorderWidth ?? 1.5;
    const innerRadius = Math.max(0, radius - ringWidth);

    const gradientContent = (
      <LinearGradient
        colors={fill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientRing, { padding: ringWidth, borderRadius: radius }]}
      >
        {backgroundGradient ? (
          <LinearGradient
            colors={backgroundGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradientInner, { borderRadius: innerRadius }, padding !== undefined && { padding }]}
          >
            {content}
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.gradientInner,
              { backgroundColor: backgroundColor ?? colors.foreground, borderRadius: innerRadius },
              padding !== undefined && { padding },
            ]}
          >
            {content}
          </View>
        )}
      </LinearGradient>
    );

    if (onPress) {
      return (
        <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
          {gradientContent}
        </Pressable>
      );
    }
    return gradientContent;
  }

  const shellStyle: ViewStyle =
    variant === 'callout'
      ? {
          backgroundColor: backgroundColor ?? hexToRgba(accent, 0.12),
          borderColor: accent,
          borderWidth: 0,
          borderLeftWidth: 3,
        }
      : {
          borderRadius: radius,
          backgroundColor: backgroundColor ?? colors.foreground,
          borderColor: accent,
          ...(borderWidth !== undefined ? { borderWidth } : null),
          ...(padding !== undefined ? { padding } : null),
          ...(accentEdgeColor !== undefined
            ? { borderLeftColor: accentEdgeColor, borderLeftWidth: accentEdgeWidth ?? 4 }
            : null),
        };

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.shell, shellStyle, { opacity: pressed ? 0.85 : 1 }]}>
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.shell, shellStyle]}>{content}</View>;
}

const styles = StyleSheet.create({
  shell: {
    padding: 16,
    borderRadius: SHELL_RADIUS,
    borderWidth: 1,
    overflow: 'hidden',
  },
  gradientRing: {
    borderRadius: SHELL_RADIUS,
    overflow: 'hidden',
  },
  gradientInner: {
    padding: 16,
    overflow: 'hidden',
  },
  // Distanza fra titolo e contenuto: unica per tutte le card titolate
  titledContent: {
    gap: 14,
  },
});
