import { useId } from 'react';
import Svg, { Defs, LinearGradient, Line, Stop } from 'react-native-svg';

type DiagonalStripesProps = {
  width: number;
  height: number;
  color: string;
  /** Spessore di ogni riga, da sinistra a destra. Ne determina anche il numero (max 5). */
  strokeWidths?: readonly number[];
  /** Opacità di ogni riga, da sinistra a destra: la prima è la più satura. */
  opacities?: readonly number[];
  /** Spazio vuoto fra il bordo di una riga e quello della successiva. */
  spacing?: number;
};

const DEFAULT_STROKE_WIDTHS = [13, 6, 9.5, 4, 6.5] as const;
const DEFAULT_OPACITIES = [0.95, 0.75, 0.6, 0.45, 0.3] as const;

/** Pattern decorativo di righe diagonali a 45°, ritagliato sul riquadro width x height:
 *  spessori variabili, pieno a sinistra, 50% fino a metà riquadro e poi sfumate a 0 verso destra. */
export function DiagonalStripes({
  width,
  height,
  color,
  strokeWidths = DEFAULT_STROKE_WIDTHS,
  opacities = DEFAULT_OPACITIES,
  spacing = 3,
}: DiagonalStripesProps) {
  const stripes = strokeWidths.slice(0, 5);
  // Passo calcolato dagli spessori (mai sovrapposte): distanza perpendicolare fra i bordi,
  // convertita in offset orizzontale con il fattore sqrt(2) delle diagonali a 45°
  const offsets = stripes.reduce<number[]>((acc, strokeWidth, index) => {
    if (index === 0) return [-height / 2];
    const step = ((stripes[index - 1] + strokeWidth) / 2 + spacing) * Math.SQRT2;
    return [...acc, acc[index - 1] + step];
  }, []);
  // id univoco per istanza: con un id fisso tutte le card riuserebbero il gradiente della prima
  const gradientId = `diagonalStripes-${useId()}`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        {/* Sfumatura orizzontale: pieno a sinistra, metà fra il 25% e il 50%, poi a 0 fino al bordo destro */}
        <LinearGradient id={gradientId} x1="0" y1="0" x2={String(width)} y2="0" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={color} stopOpacity={1} />
          {/* Stop intermedi: addolciscono la discesa 1 -> 0.5, altrimenti troppo netta */}
          <Stop offset="0.0625" stopColor={color} stopOpacity={0.96} />
          <Stop offset="0.125" stopColor={color} stopOpacity={0.85} />
          <Stop offset="0.1875" stopColor={color} stopOpacity={0.64} />
          <Stop offset="0.25" stopColor={color} stopOpacity={0.5} />
          <Stop offset="0.5" stopColor={color} stopOpacity={0.5} />
          <Stop offset="0.85" stopColor={color} stopOpacity={0} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      {stripes.map((strokeWidth, index) => {
        const x1 = offsets[index];
        return (
          <Line
            key={index}
            x1={x1}
            y1={height}
            x2={x1 + height}
            y2={0}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={opacities[index] ?? 0.3}
          />
        );
      })}
    </Svg>
  );
}
