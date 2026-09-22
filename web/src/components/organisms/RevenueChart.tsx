'use client';

import { useMemo, useState, type MouseEvent } from 'react';

interface RevenuePoint {
  date: string;
  totalAmount: number;
}

interface RevenueChartProps {
  data: RevenuePoint[];
  title: string;
}

const WIDTH = 640;
const HEIGHT = 220;
const PADDING = { top: 16, right: 16, bottom: 28, left: 50 };
const PLOT_WIDTH = WIDTH - PADDING.left - PADDING.right;
const PLOT_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom;

const dateFormatter = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short' });
const currencyFormatter = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });

// Stesso stile visivo di UserGrowthChart (STEP 2) ma non cumulativo: entrate del singolo giorno,
// non progressive — un picco resta un picco invece di sparire dietro un totale sempre crescente.
export function RevenueChart({ data, title }: RevenueChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { points, yTicks, maxValue } = useMemo(() => {
    const values = data.map((d) => d.totalAmount);
    const maxValue = Math.max(...values, 1);

    const points = data.map((d, i) => {
      const x = PADDING.left + (data.length > 1 ? (i / (data.length - 1)) * PLOT_WIDTH : PLOT_WIDTH / 2);
      const y = PADDING.top + PLOT_HEIGHT - (d.totalAmount / maxValue) * PLOT_HEIGHT;
      return { x, y, ...d };
    });

    const tickCount = 4;
    const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => (maxValue * i) / tickCount);

    return { points, yTicks, maxValue };
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

  return (
    <div className="relative rounded-2xl border border-border bg-foreground p-5">
      <p className="mb-3 text-sm text-disabled">{title}</p>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {yTicks.map((tick, i) => {
          const y = PADDING.top + PLOT_HEIGHT - (tick / maxValue) * PLOT_HEIGHT;
          return (
            <g key={i}>
              <line x1={PADDING.left} y1={y} x2={WIDTH - PADDING.right} y2={y} stroke="var(--border)" strokeWidth={1} opacity={0.4} />
              <text x={PADDING.left - 8} y={y + 4} textAnchor="end" fontSize={11} fill="var(--disabled)">
                {currencyFormatter.format(tick)}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill="var(--primary)" opacity={0.1} stroke="none" />
        <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

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
          <p className="font-semibold">{currencyFormatter.format(hovered.totalAmount)}</p>
        </div>
      )}
    </div>
  );
}
