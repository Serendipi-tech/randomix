import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Path, Stop } from 'react-native-svg';
import { Colors } from '@/constants/theme';
import { hexToRgba, mixColors } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

type RandomizerCardProps = {
  title: string;
  subtitle: string;
  onPress: () => void;
};

// Guscio proprio, non CardShell: questa card ha anello a gradiente di spessore suo e sfondo
// sfumato, due cose che il guscio condiviso non prevede
const RADIUS = 20;
const BORDER_WIDTH = 3;
const INNER_RADIUS = RADIUS - BORDER_WIDTH;

// Pennellate decorative in alto a destra: due tracciati paralleli, uno per colore del gradiente
const STROKE_BOX = { width: 130, height: 100 };
// Ogni pennellata è una forma chiusa fra due archi che si incontrano alle estremità: così finisce
// a punta da entrambi i lati, cosa impossibile con una linea a spessore costante.
// I punti di controllo stanno sopra la corda (arco invertito) e lontani da essa (arco profondo).
// Le due condividono la punta in basso a sinistra, dove il gradiente è già trasparente.
const STROKE_TIP = 'M 10 84';
const STROKE_PATH = `${STROKE_TIP} C 22 36 54 8 104 2 C 60 20 34 52 10 84 Z`;
const STROKE_PATH_SECOND = `${STROKE_TIP} C 26 50 58 26 108 30 C 62 36 34 58 10 84 Z`;

const ICON_SIZE = 36;
const ARROW_SIZE = 36;
const DIVIDER_HEIGHT = 38;

// Sfondo interno: viola medio, non il quasi nero delle superfici — il foreground tirato verso il
// primario, un po' di più a sinistra, e poi virato verso il rosso: viola rossastro, non magenta
const FILL_LEFT = 0.18;
const FILL_RIGHT = 0.05;
const FILL_RED_TINT = 0.13;
// Bagliore dorato del bordo sinistro: `GOLD_VEIL_END` è la quota di larghezza su cui si spegne,
// espressa come posizione dello stop (non come punto finale dell'asse, che lascerebbe il colore
// finale a proseguire e renderebbe la banda molto più larga)
const GOLD_VEIL_ALPHA = 0.22;
const GOLD_VEIL_END = 0.1;


/** Accesso al randomizzatore: anello a gradiente oro→magenta, icona shuffle disegnata con lo
 *  stesso gradiente, divisore, titolo e sottotitolo, freccia in un tondo. Puro render da props. */
export function RandomizerCard({ title, subtitle, onPress }: RandomizerCardProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  // Stessa coppia per anello, icona e pennellata: la card ha un unico filo cromatico
  const gradient: readonly [string, string] = [colors.secondary, colors.extraColors.eight];

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.ring}
      >
        <LinearGradient
          colors={[
            mixColors(
              mixColors(colors.foreground, colors.primary, FILL_LEFT),
              colors.extraColors.one,
              FILL_RED_TINT,
            ),
            mixColors(
              mixColors(colors.foreground, colors.primary, FILL_RIGHT),
              colors.extraColors.one,
              FILL_RED_TINT,
            ),
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.inner}
        >
          <View style={styles.brushStroke} pointerEvents="none">
            <Svg width={STROKE_BOX.width} height={STROKE_BOX.height}>
              <Defs>
                {/* Ogni pennellata svanisce verso il basso a sinistra e si accende in alto a destra */}
                <SvgLinearGradient id="randomizerBrushGold" x1="0" y1="1" x2="1" y2="0">
                  <Stop offset="0" stopColor={gradient[0]} stopOpacity={0} />
                  <Stop offset="0.55" stopColor={gradient[0]} stopOpacity={0.22} />
                  <Stop offset="1" stopColor={gradient[0]} stopOpacity={0.45} />
                </SvgLinearGradient>
                <SvgLinearGradient id="randomizerBrushMagenta" x1="0" y1="1" x2="1" y2="0">
                  <Stop offset="0" stopColor={gradient[1]} stopOpacity={0} />
                  <Stop offset="0.55" stopColor={gradient[1]} stopOpacity={0.2} />
                  <Stop offset="1" stopColor={gradient[1]} stopOpacity={0.4} />
                </SvgLinearGradient>
              </Defs>
              <Path d={STROKE_PATH_SECOND} fill="url(#randomizerBrushMagenta)" />
              <Path d={STROKE_PATH} fill="url(#randomizerBrushGold)" />
            </Svg>
          </View>

          <LinearGradient
            colors={[
              hexToRgba(colors.secondary, GOLD_VEIL_ALPHA),
              hexToRgba(colors.secondary, 0),
              hexToRgba(colors.secondary, 0),
            ]}
            locations={[0, GOLD_VEIL_END, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.goldVeil}
            pointerEvents="none"
          />


          <ShuffleGlyph from={gradient[0]} to={gradient[1]} />

          <View style={[styles.divider, { backgroundColor: hexToRgba(colors.textColor, 0.22) }]} />

          <View style={styles.texts}>
            <Text style={[styles.title, { color: colors.textColor }]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textColor }]} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>

          <View style={[styles.arrow, { backgroundColor: hexToRgba(colors.textColor, 0.1) }]}>
            <ChevronRight size={22} color={colors.textColor} strokeWidth={2.2} />
          </View>
        </LinearGradient>
      </LinearGradient>
    </Pressable>
  );
}

/** Shuffle disegnata a mano: le icone di lucide accettano un solo colore, e mascherarle con un
 *  gradiente non regge su tutte le piattaforme. Qui il gradiente è il tratto stesso. */
function ShuffleGlyph({ from, to }: { from: string; to: string }) {
  return (
    <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24">
      <Defs>
        <SvgLinearGradient id="randomizerShuffle" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={from} />
          <Stop offset="1" stopColor={to} />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M2 6h1.972a4 4 0 0 1 3.6 2.2M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22M18 14l4 4-4 4M18 2l4 4-4 4"
        stroke="url(#randomizerShuffle)"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: RADIUS,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.85,
  },
  // L'anello è il gradiente stesso: il padding ne determina lo spessore
  ring: {
    borderRadius: RADIUS,
    padding: BORDER_WIDTH,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 13,
    borderRadius: INNER_RADIUS,
    overflow: 'hidden',
  },
  // Sborda dal riquadro interno, che la ritaglia sul proprio raggio
  brushStroke: {
    position: 'absolute',
    top: -30,
    right: -28,
    // La rotazione avviene attorno al centro del riquadro, non attorno alla punta
    transform: [{ rotate: '20deg' }],
  },
  goldVeil: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  divider: {
    width: 1,
    height: DIVIDER_HEIGHT,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  // Riga descrittiva, trattata come didascalia: a misura piena il testo non sta su una riga sola
  subtitle: {
    fontSize: 12,
    opacity: 0.8,
  },
  // Solo sfondo: chiaro al 10%, nessun contorno
  arrow: {
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    borderRadius: ARROW_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
