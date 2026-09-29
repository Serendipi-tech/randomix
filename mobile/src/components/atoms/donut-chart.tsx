import Svg, { Circle } from 'react-native-svg';

export interface DonutSegment {
  key: string;
  value: number;
  color: string;
}

type DonutChartProps = {
  segments: DonutSegment[];
  trackColor: string;
  size?: number;
  strokeWidth?: number;
};

const SEGMENT_GAP = 3;

/** Donut generico via stroke-dasharray su Circle: nessuna logica di dominio, legenda esclusa
 *  (la assembla il chiamante, che conosce le etichette). Segmenti con valore 0 non disegnano nulla. */
export function DonutChart({ segments, trackColor, size = 96, strokeWidth = 14 }: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const degreesPerPx = 360 / circumference;

  let accumulated = 0;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
      {segments.map((s) => {
        const fraction = s.value / total;
        const segmentLength = fraction * circumference;
        const dash = Math.max(segmentLength - SEGMENT_GAP, 0);
        const rotation = (accumulated / total) * 360 - 90 + (SEGMENT_GAP / 2) * degreesPerPx;
        accumulated += s.value;
        if (s.value <= 0) return null;
        return (
          <Circle
            key={s.key}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={s.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeLinecap="round"
            fill="none"
            rotation={rotation}
            origin={`${size / 2}, ${size / 2}`}
          />
        );
      })}
    </Svg>
  );
}
