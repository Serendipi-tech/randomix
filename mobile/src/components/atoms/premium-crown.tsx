import { useId } from 'react';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';
import { Colors } from '@/constants/theme';
import { mixColors } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

// Il viewBox è più largo della corona: l'alone deve avere spazio attorno senza essere tagliato
const CROWN_VIEWBOX = { x: -10, y: -10, width: 68, height: 60 };
const CROWN_DESIGN_HEIGHT = 40;
const DEFAULT_HEIGHT = 26;

type PremiumCrownProps = {
  /** Altezza del disegno della corona (non del riquadro, che è più grande per via dell'alone). */
  height?: number;
};

/** Corona a tre punte, sottile, con alone dorato attorno. Niente ombre interne: il gradiente va
 *  dall'oro a un oro appena più caldo, non più scuro. La `Crown` di lucide, riempita, risultava un
 *  blocco unico senza stacco fra le punte. */
export function PremiumCrown({ height = DEFAULT_HEIGHT }: PremiumCrownProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const gold = colors.secondary;
  // Metà strada verso l'arancio del tema: resta oro, vira appena sul caldo
  const amber = mixColors(gold, colors.warning, 0.5);

  // Id univoco per istanza: con un id fisso, due corone montate insieme (banda premium e avatar)
  // userebbero entrambe il primo gradiente definito, e la seconda resterebbe invisibile
  const instanceId = useId();
  const fillId = `premiumCrown-${instanceId}`;
  const glowId = `premiumCrownGlow-${instanceId}`;

  const scale = height / CROWN_DESIGN_HEIGHT;

  return (
    <Svg
      width={CROWN_VIEWBOX.width * scale}
      height={CROWN_VIEWBOX.height * scale}
      viewBox={`${CROWN_VIEWBOX.x} ${CROWN_VIEWBOX.y} ${CROWN_VIEWBOX.width} ${CROWN_VIEWBOX.height}`}
    >
      <Defs>
        <SvgLinearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={gold} />
          <Stop offset="1" stopColor={amber} />
        </SvgLinearGradient>
        {/* Alone: sfuma a zero prima del bordo del viewBox, quindi non si vede dove finisce */}
        <RadialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={gold} stopOpacity={0.45} />
          <Stop offset="0.55" stopColor={gold} stopOpacity={0.16} />
          <Stop offset="1" stopColor={gold} stopOpacity={0} />
        </RadialGradient>
      </Defs>

      <Circle cx={24} cy={21} r={30} fill={`url(#${glowId})`} />

      <Path d="M 7 31 L 3 9 L 15.5 19 L 24 5 L 32.5 19 L 45 9 L 41 31 Z" fill={`url(#${fillId})`} />
      <Path
        d="M 7 32.5 L 41 32.5 Q 43 32.5 43 34.5 L 43 36 Q 43 38 41 38 L 7 38 Q 5 38 5 36 L 5 34.5 Q 5 32.5 7 32.5 Z"
        fill={`url(#${fillId})`}
      />
      <Circle cx={16} cy={35.2} r={1.6} fill={amber} opacity={0.7} />
      <Circle cx={24} cy={35.2} r={1.6} fill={amber} opacity={0.7} />
      <Circle cx={32} cy={35.2} r={1.6} fill={amber} opacity={0.7} />
    </Svg>
  );
}

/** Dimensione del riquadro svg per una data altezza di corona: serve a chi deve posizionarla,
 *  perché il margine trasparente dell'alone fa parte del riquadro. */
export function crownBoxSize(height: number = DEFAULT_HEIGHT) {
  const scale = height / CROWN_DESIGN_HEIGHT;
  return { width: CROWN_VIEWBOX.width * scale, height: CROWN_VIEWBOX.height * scale };
}
