import Svg, { Path, Rect } from 'react-native-svg';
import { darkenColor } from '@/utils/color';

// Proporzioni della sagoma: collo, spalle curve, corpo e fondo arrotondato dentro un viewBox 60x130
const VIEWBOX_WIDTH = 60;
const VIEWBOX_HEIGHT = 130;
export const BOTTLE_ASPECT_RATIO = VIEWBOX_WIDTH / VIEWBOX_HEIGHT;

const BODY_PATH =
  'M 24 12 L 24 42 C 24 54 12 58 12 74 L 12 114 Q 12 126 24 126 L 36 126 Q 48 126 48 114 L 48 74 C 48 58 36 54 36 42 L 36 12 Z';
// Riflesso del vetro: una sottile striscia chiara lungo il fianco sinistro
const SHINE_PATH =
  'M 28 18 L 28 44 C 28 56 17 60 17 74 L 17 110 L 22 110 L 22 74 C 22 60 33 56 33 44 L 33 18 Z';
const LABEL_DARKEN = 0.3;

type BottleGlyphProps = {
  width: number;
  height: number;
  /** Vetro del corpo: etichetta e riflesso si derivano da qui. */
  glassColor: string;
  /** Tinta del riflesso, di norma il colore del testo del tema. */
  shineColor: string;
  capColor: string;
};

/** Bottiglia disegnata: vetro, fascia dell'etichetta, riflesso e tappo. Puro render da props. */
export function BottleGlyph({ width, height, glassColor, shineColor, capColor }: BottleGlyphProps) {
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}>
      <Path d={BODY_PATH} fill={glassColor} />
      <Rect x={12} y={84} width={36} height={26} fill={darkenColor(glassColor, LABEL_DARKEN)} />
      <Path d={SHINE_PATH} fill={shineColor} opacity={0.25} />
      {/* tappo: capsula e anello del collo */}
      <Rect x={21} y={2} width={18} height={11} rx={3} fill={capColor} />
      <Rect x={22} y={15} width={16} height={4} rx={2} fill={capColor} />
    </Svg>
  );
}

/** Stessa sagoma in tinta unita, con la firma di un'icona (`size`/`color`): per tile e bottoni,
 *  dove il calice di lucide non rappresentava la modalita'. */
export function BottleIcon({ size = 24, color = '#000000' }: { size?: number; color?: string }) {
  return (
    <Svg
      width={size * BOTTLE_ASPECT_RATIO}
      height={size}
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
    >
      <Path d={BODY_PATH} fill={color} />
      <Rect x={21} y={2} width={18} height={11} rx={3} fill={color} />
    </Svg>
  );
}
