"use client";

import React from "react";

/**
 * Lightweight dependency-free SVG radar chart for the comparison duels.
 * Values are 0–100 on each axis.
 */
export interface RadarSeries {
  name: string;
  values: number[]; // one value per axis, 0-100
  color: string; // stroke/fill color
}

export function RadarChart({
  axes,
  series,
  size = 320,
}: {
  axes: string[];
  series: RadarSeries[];
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 44;
  const n = axes.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, value: number) => {
    const r = (Math.min(100, Math.max(0, value)) / 100) * radius;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  };

  const rings = [25, 50, 75, 100];
  const ringPoints = (pct: number) =>
    axes.map((_, i) => point(i, pct).map((v) => v.toFixed(1)).join(",")).join(" ");

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Performance radar chart"
        className="max-w-full"
      >
        {/* grid rings */}
        {rings.map((pct) => (
          <polygon
            key={pct}
            points={ringPoints(pct)}
            fill="none"
            stroke="currentColor"
            className="text-border"
            strokeWidth={pct === 100 ? 1.2 : 0.6}
          />
        ))}
        {/* axis lines + labels */}
        {axes.map((a, i) => {
          const [x, y] = point(i, 100);
          const [lx, ly] = point(i, 122);
          return (
            <g key={a}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke="currentColor" className="text-border" strokeWidth={0.6} />
              <text
                x={lx}
                y={ly}
                textAnchor={Math.abs(lx - cx) < 12 ? "middle" : lx > cx ? "start" : "end"}
                dominantBaseline="middle"
                className="fill-current text-muted-foreground"
                fontSize={10}
                fontWeight={600}
              >
                {a}
              </text>
            </g>
          );
        })}
        {/* series */}
        {series.map((s) => (
          <polygon
            key={s.name}
            points={s.values.map((v, i) => point(i, v).map((c) => c.toFixed(1)).join(",")).join(" ")}
            fill={s.color}
            fillOpacity={0.14}
            stroke={s.color}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        ))}
      </svg>
      {/* legend */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {series.map((s) => (
          <span key={s.name} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Colors used for radar series (matches winner/medal palette). */
export const RADAR_COLORS = ["#f59e0b", "#22d3ee", "#34d399", "#a78bfa"];
