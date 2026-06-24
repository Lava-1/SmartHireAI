import React from 'react';
import { RadarScores } from '../types';

interface SvgRadarChartProps {
  scores: RadarScores;
}

export const SvgRadarChart: React.FC<SvgRadarChartProps> = ({ scores }) => {
  const size = 300;
  const center = size / 2;
  const maxRadius = 110;

  const categories = [
    { label: 'Communication', val: scores.Communication || 80 },
    { label: 'Technical', val: scores.Technical || 85 },
    { label: 'Problem Solving', val: scores.ProblemSolving || 82 },
    { label: 'Culture Fit', val: scores.CultureFit || 88 },
    { label: 'Code Efficiency', val: scores.CodeEfficiency || 90 }
  ];

  const total = categories.length;
  const angleSlice = (Math.PI * 2) / total;

  const getCoordinates = (value: number, idx: number) => {
    const r = (value / 100) * maxRadius;
    const angle = idx * angleSlice - Math.PI / 2;
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)];
  };

  const pointsString = categories
    .map((c, i) => getCoordinates(c.val, i).join(','))
    .join(' ');

  // Grid levels
  const levels = [25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible max-w-[320px]">
        {/* Background Web Levels */}
        {levels.map(level => {
          const r = (level / 100) * maxRadius;
          const levelPoints = categories
            .map((_, i) => {
              const angle = i * angleSlice - Math.PI / 2;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            })
            .join(' ');
          return (
            <polygon
              key={level}
              points={levelPoints}
              fill="none"
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray={level === 50 || level === 75 ? '3,3' : undefined}
            />
          );
        })}

        {/* Axis Spokes */}
        {categories.map((_, i) => {
          const angle = i * angleSlice - Math.PI / 2;
          const x2 = center + maxRadius * Math.cos(angle);
          const y2 = center + maxRadius * Math.sin(angle);
          return <line key={i} x1={center} y1={center} x2={x2} y2={y2} stroke="#475569" strokeWidth="1" />;
        })}

        {/* Radar Polygon Shape */}
        <polygon
          points={pointsString}
          fill="rgba(59, 130, 246, 0.35)"
          stroke="#3b82f6"
          strokeWidth="2.5"
        />

        {/* Data Vertices */}
        {categories.map((c, i) => {
          const [x, y] = getCoordinates(c.val, i);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Category Labels */}
        {categories.map((c, i) => {
          const labelRadius = maxRadius + 26;
          const angle = i * angleSlice - Math.PI / 2;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-300 font-mono text-[11px] font-bold"
            >
              {c.label} ({c.val}%)
            </text>
          );
        })}
      </svg>
    </div>
  );
};
