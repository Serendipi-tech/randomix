import { StyleSheet, Text, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { DICE_COLORS } from '@/constants/dice';
import { bucketForFaces, PIP_LAYOUT } from '@/utils/diceShapes';

type DiceFaceProps = {
  value: number;
  faces: number;
};

const SIZE = 58;
// esagono "a punta in alto" dentro un viewBox 100x100, stroke arrotondato per evitare angoli vivi
const HEXAGON_POINTS = '50,12 82.9,31 82.9,69 50,88 17.1,69 17.1,31';

const diceShadow = {
  shadowColor: DICE_COLORS.bevel,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.6,
  shadowRadius: 6,
  elevation: 3,
} as const;

/** Faccia di un dado: pallini per facce <=6 (come il d6 esistente, estesi al d4), numero su
 *  sagoma via via più arrotondata (rombo, esagono, cerchio) al crescere delle facce. Stessa
 *  palette decorativa del dado esistente in ogni sagoma: nessun colore nuovo introdotto. */
export function DiceFace({ value, faces }: DiceFaceProps) {
  const bucket = bucketForFaces(faces);

  if (bucket === 'pip') {
    const active = PIP_LAYOUT[value] ?? [];
    return (
      <View style={[styles.square, diceShadow]}>
        <View style={styles.pipGrid}>
          {Array.from({ length: 9 }, (_, i) => i + 1).map((cell) => (
            <View key={cell} style={styles.pipCell}>
              {active.includes(cell) && <View style={styles.pipDot} />}
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (bucket === 'diamond') {
    return (
      <View style={[styles.square, { alignItems: 'center', justifyContent: 'center' }]}>
        <View style={[styles.diamond, diceShadow]}>
          <View style={styles.diamondContent}>
            <DiceLabel value={value} faces={faces} />
          </View>
        </View>
      </View>
    );
  }

  if (bucket === 'hexagon') {
    return (
      <View style={[styles.square, diceShadow]}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100">
          <Polygon
            points={HEXAGON_POINTS}
            fill={DICE_COLORS.face}
            stroke={DICE_COLORS.border}
            strokeWidth={12}
            strokeLinejoin="round"
          />
        </Svg>
        <View style={styles.overlay}>
          <DiceLabel value={value} faces={faces} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.square, styles.circle, diceShadow]}>
      <DiceLabel value={value} faces={faces} />
    </View>
  );
}

function DiceLabel({ value, faces }: DiceFaceProps) {
  return (
    <>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.tag}>d{faces}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  square: {
    width: SIZE,
    height: SIZE,
    borderRadius: 16,
    backgroundColor: DICE_COLORS.face,
    borderWidth: 2,
    borderColor: DICE_COLORS.border,
    overflow: 'hidden',
  },
  circle: {
    borderRadius: SIZE / 2,
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
    backgroundColor: DICE_COLORS.pip,
  },
  diamond: {
    width: SIZE * 0.74,
    height: SIZE * 0.74,
    borderRadius: 10,
    backgroundColor: DICE_COLORS.face,
    borderWidth: 2,
    borderColor: DICE_COLORS.border,
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
    color: DICE_COLORS.pip,
  },
  tag: {
    fontSize: 9,
    fontWeight: '700',
    color: DICE_COLORS.pip,
    opacity: 0.6,
    marginTop: -2,
  },
});
