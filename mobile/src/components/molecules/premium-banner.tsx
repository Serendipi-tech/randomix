import { useState } from 'react';
import { ChevronRight } from 'lucide-react-native';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { Colors } from '@/constants/theme';
import { hexToRgba, mixColors } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

type PremiumBannerProps = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  onPress: () => void;
};

// Fondo: lo sfondo del tema tirato verso il blu del tema (`info`), non verso il ciano — il ciano
// resta al bordo, al bagliore e alla pillola. Il blu tiene la maggior parte della banda, più carico
// a sinistra, e solo l'ultimo tratto a destra scende verso lo sfondo dell'app
const FILL_STOPS = [0.3, 0.2, 0.02] as const;
const FILL_LOCATIONS = [0, 0.66, 1] as const;

/** Nube di cerchi chiari sul lato sinistro: centri sparsi e ravvicinati fra il bordo alto, quello
 *  sinistro e quello basso, raggi vari, in unità del loro riquadro. Riempimento piatto e traslucido, mai
 *  sfumato: sovrapponendosi le trasparenze si sommano, e la massa di archi legge come una nube che
 *  si dirada verso destra. */
const BUBBLES = [
  { cx: -10, cy: 28, r: 34 },
  { cx: -4, cy: 10, r: 24 },
  { cx: -2, cy: 48, r: 25 },
  { cx: 4, cy: 30, r: 20 },
  { cx: 8, cy: 16, r: 18 },
  { cx: 10, cy: 44, r: 17 },
  { cx: 16, cy: 6, r: 16 },
  { cx: 18, cy: 34, r: 20 },
  { cx: 22, cy: 52, r: 14 },
  { cx: 26, cy: 20, r: 17 },
  { cx: 30, cy: 42, r: 15 },
  { cx: 34, cy: 12, r: 13 },
  { cx: 36, cy: 30, r: 16 },
  { cx: 42, cy: 46, r: 11 },
  { cx: 44, cy: 22, r: 12 },
] as const;
// Tinta e alpha: ogni cerchio è un velo di accent cosi' tenue che, anche dove se ne sovrappongono
// una decina, la somma resta sotto l'intensità del bordo — che è il punto più acceso della banda
const BUBBLE_FILL_ALPHA = 0.07;
const BUBBLES_BOX = { width: 130, height: 60 };

// Il viewBox è più largo della corona: l'alone deve avere spazio attorno senza essere tagliato
const CROWN_VIEWBOX = { x: -10, y: -10, width: 68, height: 60 };
const CROWN_HEIGHT = 26;
const CROWN_SCALE = CROWN_HEIGHT / 40;
// Il riquadro della corona ha un margine trasparente attorno al disegno (serve all'alone): questo
// valore negativo ne riassorbe una parte, avvicinando i testi senza spostare la corona
const CROWN_TEXT_SPACING = -6;

// Chiaro dello schema scuro: serve a schiarire l'accent indipendentemente dal tema attivo, perché
// il riflesso della pillola deve virare al bianco e non al colore del testo corrente
const LIGHT_INK = Colors.dark.textColor;
// Inchiostro della pillola: lo scuro della palette (mai nero puro) alleggerito verso il chiaro,
// così resta leggibile sul ciano senza pesare come un testo pieno
const CTA_INK = mixColors(Colors.dark.background, LIGHT_INK, 0.25);

/** Le due luci, fra il testo e la pillola. `gap` è la distanza dal fianco sinistro della pillola:
 *  la posizione si ricava dalla larghezza misurata della pillola, così cambiarne padding o
 *  etichetta non può più finire per coprirle. */
const SPARKLES = [
  { gap: 2, top: 9, size: 21, opacity: 0.35, mirrored: false },
  { gap: 20, bottom: 9, size: 13, opacity: 0.25, mirrored: true },
] as const;
// Padding orizzontale della banda: separa il bordo destro dal fianco della pillola
const BANNER_PADDING = 12;
// Tinta delle luci: accent tirato verso il chiaro, così staccano dal fondo senza pesare
const SPARKLE_LIGHTEN = 0.45;

/** Banda "passa a premium": corona dorata, titolo e sottotitolo, pillola di invito a destra.
 *  Tutta la banda è premibile — la pillola fa parte del disegno, non è un secondo bersaglio.
 *  Puro render da props. */
export function PremiumBanner({ title, subtitle, ctaLabel, onPress }: PremiumBannerProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const [ctaWidth, setCtaWidth] = useState(0);

  const onCtaLayout = (e: LayoutChangeEvent) => setCtaWidth(e.nativeEvent.layout.width);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}>
      <LinearGradient
        colors={[
          mixColors(colors.background, colors.info, FILL_STOPS[0]),
          mixColors(colors.background, colors.info, FILL_STOPS[1]),
          mixColors(colors.background, colors.info, FILL_STOPS[2]),
        ]}
        locations={FILL_LOCATIONS}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 1, y: 0.9 }}
        style={styles.banner}
      >
        {/* Bagliore interno: alone morbido lungo tutto il bordo, dentro la banda */}
        <View
          style={[
            styles.innerGlow,
            {
              borderColor: hexToRgba(colors.accent, 0.6),
              // due aloni sovrapposti: uno stretto sul bordo e uno molto largo e debole, così la
              // luce sfuma verso il centro invece di fermarsi di colpo
              boxShadow: `inset 0 0 10px 0 ${hexToRgba(colors.accent, 0.22)}, inset 0 0 34px 6px ${hexToRgba(colors.accent, 0.14)}`,
            },
          ]}
          pointerEvents="none"
        />

        <View style={styles.bubbles} pointerEvents="none">
          <Svg width={BUBBLES_BOX.width} height={BUBBLES_BOX.height}>
            {BUBBLES.map((bubble, i) => (
              <Circle
                key={i}
                cx={bubble.cx}
                cy={bubble.cy}
                r={bubble.r}
                fill={hexToRgba(colors.accent, BUBBLE_FILL_ALPHA)}
              />
            ))}
          </Svg>
        </View>

        <View style={styles.sparkles} pointerEvents="none">
          {ctaWidth > 0 &&
            SPARKLES.map((sparkle, i) => (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  right: ctaWidth + BANNER_PADDING + sparkle.gap,
                  top: 'top' in sparkle ? sparkle.top : undefined,
                  bottom: 'bottom' in sparkle ? sparkle.bottom : undefined,
                  opacity: sparkle.opacity,
                }}
              >
                <SparkGlyph
                  gradientId={`premiumSpark${i}`}
                  size={sparkle.size}
                  color={mixColors(colors.accent, LIGHT_INK, SPARKLE_LIGHTEN)}
                  mirrored={sparkle.mirrored}
                />
              </View>
            ))}
        </View>

        <View style={styles.crown}>
          <CrownGlyph gold={colors.secondary} warm={colors.warning} />
        </View>

        <View style={styles.texts}>
          <Text style={[styles.title, { color: colors.textColor }]} numberOfLines={1}>
            {title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textColor }]} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>

        <LinearGradient
          colors={[colors.info, colors.accent]}
          onLayout={onCtaLayout}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.cta, { boxShadow: `0 1px 10px 0 ${hexToRgba(colors.accent, 0.5)}` }]}
        >
          <Text style={[styles.ctaLabel, { color: CTA_INK }]}>{ctaLabel}</Text>
          <ChevronRight size={17} color={CTA_INK} strokeWidth={3} />
        </LinearGradient>
      </LinearGradient>
    </Pressable>
  );
}

/** Luce a quattro punte con i fianchi concavi: punte lunghe ma lobi pieni, al contrario della
 *  `Sparkle` di lucide che è arrotondata. La sagoma è asimmetrica (punta alta spostata e braccio
 *  destro più lungo), così `mirrored` si vede davvero. */
function SparkGlyph({
  gradientId,
  size,
  color,
  mirrored = false,
}: {
  /** Id del gradiente: deve essere unico per istanza, gli id SVG non sono isolati per componente. */
  gradientId: string;
  size: number;
  color: string;
  mirrored?: boolean;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={mirrored ? styles.mirrored : undefined}
    >
      <Defs>
        {/* Nucleo acceso e punte quasi dissolte: la sagoma si sfuma senza bisogno di sfocarla */}
        <RadialGradient id={`${gradientId}core`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={color} stopOpacity={1} />
          <Stop offset="0.35" stopColor={color} stopOpacity={0.78} />
          <Stop offset="0.7" stopColor={color} stopOpacity={0.42} />
          <Stop offset="1" stopColor={color} stopOpacity={0.08} />
        </RadialGradient>
        {/* Alone tondo dietro la sagoma: toglie il contorno netto e la rende soffusa */}
        <RadialGradient id={`${gradientId}halo`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={color} stopOpacity={0.26} />
          <Stop offset="0.55" stopColor={color} stopOpacity={0.08} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={12} cy={12} r={12} fill={`url(#${gradientId}halo)`} />
      <Path
        d="M 13 0 C 14.4 7.4 17.6 10.6 24 12 C 17.6 13.4 14.4 16.6 13 24 C 11.6 17.4 8 14 1.5 12.6 C 8 11 11.6 7.4 13 0 Z"
        fill={`url(#${gradientId}core)`}
      />
    </Svg>
  );
}

/** Corona a tre punte, sottile, con alone dorato attorno. Niente ombre interne: il gradiente va
 *  dall'oro a un oro appena più caldo, non più scuro. La `Crown` di lucide, riempita, risultava un
 *  blocco unico senza stacco fra le punte. */
function CrownGlyph({ gold, warm }: { gold: string; warm: string }) {
  // Metà strada verso l'arancio del tema: resta oro, vira appena sul caldo
  const amber = mixColors(gold, warm, 0.5);

  return (
    <Svg
      width={CROWN_VIEWBOX.width * CROWN_SCALE}
      height={CROWN_VIEWBOX.height * CROWN_SCALE}
      viewBox={`${CROWN_VIEWBOX.x} ${CROWN_VIEWBOX.y} ${CROWN_VIEWBOX.width} ${CROWN_VIEWBOX.height}`}
    >
      <Defs>
        <SvgLinearGradient id="premiumCrown" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={gold} />
          <Stop offset="1" stopColor={amber} />
        </SvgLinearGradient>
        {/* Alone: sfuma a zero prima del bordo del viewBox, quindi non si vede dove finisce */}
        <RadialGradient id="premiumCrownGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={gold} stopOpacity={0.45} />
          <Stop offset="0.55" stopColor={gold} stopOpacity={0.16} />
          <Stop offset="1" stopColor={gold} stopOpacity={0} />
        </RadialGradient>
      </Defs>

      <Circle cx={24} cy={21} r={30} fill="url(#premiumCrownGlow)" />

      <Path
        d="M 7 31 L 3 9 L 15.5 19 L 24 5 L 32.5 19 L 45 9 L 41 31 Z"
        fill="url(#premiumCrown)"
      />
      <Path
        d="M 7 32.5 L 41 32.5 Q 43 32.5 43 34.5 L 43 36 Q 43 38 41 38 L 7 38 Q 5 38 5 36 L 5 34.5 Q 5 32.5 7 32.5 Z"
        fill="url(#premiumCrown)"
      />
      <Circle cx={16} cy={35.2} r={1.6} fill={amber} opacity={0.7} />
      <Circle cx={24} cy={35.2} r={1.6} fill={amber} opacity={0.7} />
      <Circle cx={32} cy={35.2} r={1.6} fill={amber} opacity={0.7} />
    </Svg>
  );
}

// Stesso valore di SHELL_RADIUS in CardShell: la banda si allinea alle card che le stanno attorno
const RADIUS = 12;

const styles = StyleSheet.create({
  wrap: {
    borderRadius: RADIUS,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.85,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: BANNER_PADDING,
    paddingVertical: 6,
    borderRadius: RADIUS,
  },
  // Bordo e alone stanno su uno strato a parte: così il bagliore resta dentro, sopra il
  // gradiente, senza schiarire anche il contenuto
  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: RADIUS,
    borderWidth: 2,
  },
  mirrored: {
    transform: [{ scaleX: -1 }],
  },
  // Contenuto sopra gli strati decorativi: senza un livello esplicito, su Android una vista
  // assoluta può finire davanti a un fratello in flusso
  crown: {
    zIndex: 1,
    marginLeft: -3,
    marginRight: CROWN_TEXT_SPACING,
  },
  sparkles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  // Ancorate a sinistra e centrate in verticale: la banda le taglia ai suoi bordi
  bubbles: {
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -BUBBLES_BOX.height / 2,
    zIndex: 0,
  },
  texts: {
    flex: 1,
    // Il discendente dell'ultima riga è spazio vuoto che conta nel centraggio: senza questo
    // compenso il blocco di testo appare più in basso del resto della banda
    paddingBottom: 3,
  },
  // lineHeight serrata: avvicina le due righe senza margini negativi
  title: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 18,
    includeFontPadding: false,
  },
  // Riga di servizio sotto al titolo, trattata come didascalia: resta la misura piu' piccola
  // ammessa dal progetto
  subtitle: {
    fontSize: 12,
    lineHeight: 14,
    includeFontPadding: false,
    opacity: 0.75,
  },
  // Il chevron non riempie il suo quadrato: il disegno finisce a circa 5px dal lato destro
  // dell'icona, quindi il padding destro è ridotto di altrettanto per pareggiare otticamente
  // lo spazio che sta a sinistra della prima lettera
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingLeft: 11,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 999,
  },
  // Altezza di riga esplicita: senza, il box del testo va da ascendente a discendente e il
  // centraggio della riga lascia più spazio sotto che sopra
  ctaLabel: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
