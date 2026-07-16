import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { Accent, DiceShading } from '@/constants/theme';

const DICE_SIZE = 108;
const PIP_SIZE = 17;
const GLOW_SIZE = DICE_SIZE + 90;

/** Pattern "5" classico di un dado: 4 pip agli angoli + 1 al centro. */
const PIPS = [
  { top: 18, left: 18 },
  { top: 18, right: 18 },
  { top: '50%' as const, left: '50%' as const, center: true },
  { bottom: 18, left: 18 },
  { bottom: 18, right: 18 },
];

/** Dado dell'app, puramente presentazionale: l'animazione d'ingresso è guidata da chi lo usa (vedi useAuthIntro). */
export function DiceLogo() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Accent.violet, `${Accent.violet}00`]}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={styles.glow}
      />

      <View style={styles.body}>
        <LinearGradient
          colors={[DiceShading.highlight, 'transparent']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.6 }}
          style={styles.bevelHighlight}
        />
        <LinearGradient
          colors={['transparent', DiceShading.shadowEdge]}
          start={{ x: 0.5, y: 0.55 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.bevelShadow}
        />

        {PIPS.map((pip, i) => (
          <View
            key={i}
            style={[
              styles.pip,
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
            <View style={styles.pipShine} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
    opacity: 0.4,
  },
  body: {
    width: DICE_SIZE,
    height: DICE_SIZE,
    borderRadius: 24,
    backgroundColor: DiceShading.face,
    borderWidth: 2,
    borderColor: DiceShading.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 10,
  },
  bevelHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    opacity: 0.8,
  },
  bevelShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
  },
  pip: {
    position: 'absolute',
    width: PIP_SIZE,
    height: PIP_SIZE,
    borderRadius: PIP_SIZE / 2,
    backgroundColor: DiceShading.pip,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  pipShine: {
    width: PIP_SIZE * 0.35,
    height: PIP_SIZE * 0.35,
    borderRadius: PIP_SIZE * 0.2,
    backgroundColor: 'rgba(255,255,255,0.55)',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
});
