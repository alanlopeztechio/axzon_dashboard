'use client';
import React from 'react';
import { PieChart, Pie as RechartsPie, Cell } from 'recharts';

type CompliancePieProps = {
  value: number;
  size?: number;
  innerRadius?: number;
  outerRadius?: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const Pie = ({
  value,
  size = 100,
  innerRadius = 34,
  outerRadius = 45,
}: CompliancePieProps) => {
  const normalizedValue = clamp(Math.round(value), 0, 100);
  const data = [
    { name: 'compliance', value: normalizedValue, color: '#c0392b' },
    { name: 'remaining', value: 100 - normalizedValue, color: '#2c3e6b' },
  ];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <PieChart width={size} height={size}>
        <RechartsPie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          strokeWidth={0}
          isAnimationActive={false}
        >
          {data.map((slice) => (
            <Cell key={slice.name} fill={slice.color} />
          ))}
        </RechartsPie>
      </PieChart>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none w-full h-full">
        <span
          className={`text-[#c0392b] text-[${size * 0.18}px] font-bold leading-none`}
        >
          {normalizedValue}%
        </span>
      </div>
    </div>
  );
};

export default Pie;
