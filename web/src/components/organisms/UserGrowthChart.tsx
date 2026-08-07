'use client';

import { useMemo, useState, type MouseEvent } from 'react';

interface GrowthPoint {
  date: string;
  totalUsers: number;
}

interface UserGrowthChartProps {
  data: GrowthPoint[];
}

const WIDTH = 640;
const HEIGHT = 220;
const PADDING = { top: 16, right: 16, bottom: 28, left: 44 };
const PLOT_WIDTH = WIDTH - PADDING.left - PADDING.right;
const PLOT_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom;

const dateFormatter = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short' });

// Trend nel tempo: serie singola, quindi un solo hue (--primary) e nessuna legenda (il titolo dice cosa è plottato).
export function UserGrowthChart({ data }: UserGrowthChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { points, yTicks, maxValue, minValue } = useMemo(() => {
    const values = data.map((d) => d.totalUsers);
    const maxValue = Math.max(...values, 1);
    const minValue = Math.min(...values, 0);
    const span = maxValue - minValue || 1;

    const points = data.map((d, i) => {
      const x = PADDING.left + (data.length > 1 ? (i / (data.length - 1)) * PLOT_WIDTH : PLOT_WIDTH / 2);
      const y = PADDING.top + PLOT_HEIGHT - ((d.totalUsers - minValue) / span) * PLOT_HEIGHT;
      return { x, y, ...d };
    });

    const tickCount = 4;
    const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => Math.round(minValue + (span * i) / tickCount));

    return { points, yTicks, maxValue, minValue };
  }, [data]);

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? 0} ${PADDING.top + PLOT_HEIGHT} L ${points[0]?.x ?? 0} ${PADDING.top + PLOT_HEIGHT} Z`;

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;
    let nearestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - relativeX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  };

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;
  const lastPoint = points[points.length - 1];

  return (
    <div className="relative rounded-2xl border border-border bg-foreground p-5">
      <p className="mb-3 text-sm text-disabled">Crescita utenti (ultimi 30 giorni)</p>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {yTicks.map((tick, i) => {
          const y = PADDING.top + PLOT_HEIGHT - ((tick - minValue) / (maxValue - minValue || 1)) * PLOT_HEIGHT;
          return (
            <g key={i}>
              <line x1={PADDING.left} y1={y} x2={WIDTH - PADDING.right} y2={y} stroke="var(--border)" strokeWidth={1} opacity={0.4} />
              <text x={PADDING.left - 8} y={y + 4} textAnchor="end" fontSize={11} fill="var(--disabled)">
                {tick}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill="var(--primary)" opacity={0.1} stroke="none" />
        <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {lastPoint && (
          <>
            <circle cx={lastPoint.x} cy={lastPoint.y} r={4} fill="var(--primary)" stroke="var(--foreground)" strokeWidth={2} />
            <text x={lastPoint.x} y={lastPoint.y - 10} textAnchor="end" fontSize={12} fontWeight={600} fill="var(--text-color)">
              {lastPoint.totalUsers}
            </text>
          </>
        )}

        {data.length > 1 && (
          <>
            <text x={points[0].x} y={HEIGHT - 8} textAnchor="start" fontSize={11} fill="var(--disabled)">
              {dateFormatter.format(new Date(data[0].date))}
            </text>
            <text x={points[points.length - 1].x} y={HEIGHT - 8} textAnchor="end" fontSize={11} fill="var(--disabled)">
              {dateFormatter.format(new Date(data[data.length - 1].date))}
            </text>
          </>
        )}

        {hovered && (
          <>
            <line x1={hovered.x} y1={PADDING.top} x2={hovered.x} y2={PADDING.top + PLOT_HEIGHT} stroke="var(--border)" strokeWidth={1} />
            <circle cx={hovered.x} cy={hovered.y} r={4} fill="var(--primary)" stroke="var(--foreground)" strokeWidth={2} />
          </>
        )}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-text-color shadow-lg"
          style={{ left: `${(hovered.x / WIDTH) * 100}%`, top: 8, transform: 'translateX(-50%)' }}
        >
          <p className="text-disabled">{dateFormatter.format(new Date(hovered.date))}</p>
          <p className="font-semibold">{hovered.totalUsers} utenti</p>
        </div>
      )}
    </div>
  );
}
