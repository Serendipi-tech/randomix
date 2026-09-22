import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type RatingVariant = 'compact' | 'medium' | 'extended';

type RatingProps = {
  variant: RatingVariant;
  /** 0-5, può essere frazionario (usato solo in "compact"). */
  value?: number;
  color: string;
  inactiveColor: string;
  /** medium: apre la bottomsheet al tap sul gruppo di stelle (sola visualizzazione, nessuna stella singola cliccabile). */
  onPress?: () => void;
  /** extended: imposta il valore al tap sulla singola stella. */
  onChange?: (value: number) => void;
};

const MAX_STARS = 5;
const STARS = Array.from({ length: MAX_STARS }, (_, i) => i + 1);
const STAR_SIZE: Record<RatingVariant, number> = {
  compact: 14,
  medium: 18,
  extended: 32,
};

/** Singolo glifo stella: due copie sovrapposte dello stesso carattere "★", quella piena ritagliata in
 *  larghezza in base a `fillPercent` (0-100) e animata — stessa identica resa in ogni variante/taglia,
 *  così "compact"/"medium"/"extended" restano visivamente la stessa stella solo ridimensionata. */
function StarGlyph({
  size,
  fillPercent,
  color,
  inactiveColor,
}: {
  size: number;
  fillPercent: number;
  color: string;
  inactiveColor: string;
}) {
  const progress = useSharedValue(fillPercent);

  useEffect(() => {
    progress.value = withTiming(fillPercent, { duration: 250, easing: Easing.out(Easing.quad) });
  }, [fillPercent, progress]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value}%` }));

  return (
    <View style={{ width: size, height: size }}>
      <Text style={[styles.glyphBase, { color: inactiveColor, fontSize: size, lineHeight: size }]}>★</Text>
      <Animated.View style={[styles.fill, { height: size }, fillStyle]}>
        <Text style={[styles.glyphFill, { color, fontSize: size, lineHeight: size }]}>★</Text>
      </Animated.View>
    </View>
  );
}

/** Rating a stelle in tre varianti, stesso glifo ridimensionato in tutte:
 *  - compact: una stella con riempimento frazionario + valore numerico, sola visualizzazione (card item).
 *  - medium: 5 stelle piccole arrotondate, sola visualizzazione, tap sul gruppo apre la bottomsheet di modifica.
 *  - extended: 5 stelle grandi, ognuna cliccabile singolarmente per impostare il voto. */
export function Rating({ variant, value = 0, color, inactiveColor, onPress, onChange }: RatingProps) {
  const size = STAR_SIZE[variant];

  if (variant === 'compact') {
    const fillPercent = (Math.min(Math.max(value, 0), MAX_STARS) / MAX_STARS) * 100;
    return (
      <View style={styles.compactRow}>
        <StarGlyph size={size} fillPercent={fillPercent} color={color} inactiveColor={inactiveColor} />
        <Text style={[styles.compactValue, { color }]}>{value.toFixed(1)}</Text>
      </View>
    );
  }

  const rounded = Math.round(value);

  if (variant === 'medium') {
    const stars = STARS.map((n) => (
      <StarGlyph key={n} size={size} fillPercent={n <= rounded ? 100 : 0} color={color} inactiveColor={inactiveColor} />
    ));
    // Senza onPress è pura visualizzazione (es. riga di una recensione): niente Pressable "morto"
    if (!onPress) return <View style={styles.mediumRow}>{stars}</View>;
    return (
      <Pressable onPress={onPress} hitSlop={4} style={styles.mediumRow}>
        {stars}
      </Pressable>
    );
  }

  return (
    <View style={styles.starsRow}>
      {STARS.map((n) => (
        <Pressable key={n} onPress={() => onChange?.(n)} hitSlop={8}>
          <StarGlyph size={size} fillPercent={n <= rounded ? 100 : 0} color={color} inactiveColor={inactiveColor} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  glyphBase: {
    position: 'absolute',
  },
  fill: {
    position: 'absolute',
    overflow: 'hidden',
  },
  glyphFill: {},
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  mediumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 8,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
});
