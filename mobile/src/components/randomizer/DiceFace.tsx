import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Polygon, Stop } from 'react-native-svg';
import { Colors } from '@/constants/theme';
import { darkenColor } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { bucketForFaces, PIP_LAYOUT, type DiceShapeBucket } from '@/utils/diceShapes';

type DiceFaceProps = {
  value: number;
  faces: number;
};

const SIZE = 58;
// esagono "a punta in alto" dentro un viewBox 100x100, stroke arrotondato per evitare angoli vivi
const HEXAGON_POINTS = '50,12 82.9,31 82.9,69 50,88 17.1,69 17.1,31';
// scurimento per il secondo stop del gradiente, derivato dal token (mai un hex nuovo)
const DARKEN_AMOUNT = 0.22;

// unione dei due schemi: `Colors[colorScheme]` non è restringibile a un solo scheme (literal `as const`)
type ThemeColors = typeof Colors.light | typeof Colors.dark;

function gemGradient(colors: ThemeColors, bucket: DiceShapeBucket): readonly [string, string] {
  const base =
    bucket === 'diamond' ? colors.secondaryGradient : bucket === 'hexagon' ? colors.extraColors.six : colors.accent;
  return [base, darkenColor(base, DARKEN_AMOUNT)] as const;
}

/** Faccia di un dado: pallini per facce <=6 (incluso d4), numero su sagoma via via più
 *  arrotondata (rombo, esagono, cerchio) al crescere delle facce — più facce ha il dado,
 *  più la forma tende al cerchio. */
export function DiceFace({ value, faces }: DiceFaceProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const bucket = bucketForFaces(faces);

  if (bucket === 'pip') {
    const active = PIP_LAYOUT[value] ?? [];
    return (
      <View style={[styles.square, { backgroundColor: colors.foreground, borderColor: colors.border }]}>
        <View style={styles.pipGrid}>
          {Array.from({ length: 9 }, (_, i) => i + 1).map((cell) => (
            <View key={cell} style={styles.pipCell}>
              {active.includes(cell) && (
                <View
                  style={[
                    styles.pipDot,
                    { backgroundColor: colors.secondary, shadowColor: colors.secondary },
                  ]}
                />
              )}
            </View>
          ))}
        </View>
      </View>
    );
  }

  const [from, to] = gemGradient(colors, bucket);

  if (bucket === 'diamond') {
    return (
      <View style={[styles.square, styles.transparentSquare, { alignItems: 'center', justifyContent: 'center' }]}>
        <View style={styles.diamondOuter}>
          <LinearGradient colors={[from, to]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.diamondShape}>
            <View style={styles.diamondContent}>
              <DiceLabel value={value} faces={faces} ink={colors.background} />
            </View>
          </LinearGradient>
        </View>
      </View>
    );
  }

  if (bucket === 'hexagon') {
    return (
      <View style={[styles.square, styles.transparentSquare]}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100">
          <Defs>
            <SvgLinearGradient id="hexGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={from} />
              <Stop offset="1" stopColor={to} />
            </SvgLinearGradient>
          </Defs>
          <Polygon
            points={HEXAGON_POINTS}
            fill="url(#hexGrad)"
            stroke="url(#hexGrad)"
            strokeWidth={14}
            strokeLinejoin="round"
          />
        </Svg>
        <View style={styles.overlay}>
          <DiceLabel value={value} faces={faces} ink={colors.background} />
        </View>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[from, to]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.square, styles.circle, { borderWidth: 0 }]}
    >
      <DiceLabel value={value} faces={faces} ink={colors.background} />
    </LinearGradient>
  );
}

function DiceLabel({ value, faces, ink }: DiceFaceProps & { ink: string }) {
  return (
    <>
      <Text style={[styles.value, { color: ink }]}>{value}</Text>
      <Text style={[styles.tag, { color: ink }]}>d{faces}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  square: {
    width: SIZE,
    height: SIZE,
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
  },
  transparentSquare: {
    borderWidth: 0,
  },
  circle: {
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 9,
  },
  pipCell: {
    width: '33.33%',
    height: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  diamondOuter: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondShape: {
    width: SIZE * 0.74,
    height: SIZE * 0.74,
    borderRadius: SIZE * 0.74 * 0.2,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondContent: {
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
  },
  value: {
    fontSize: 17,
    fontWeight: '800',
  },
  tag: {
    fontSize: 9,
    fontWeight: '700',
    opacity: 0.6,
    marginTop: -2,
  },
});
