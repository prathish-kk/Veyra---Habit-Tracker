/** BarChart component showing habit completion percentage by day of week (Corbel theme). */
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import type { WeekdayStat } from '../types';

interface WeekdayBreakdownChartProps {
  data: WeekdayStat[];
}

export const WeekdayBreakdownChart: React.FC<WeekdayBreakdownChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-[var(--color-text-muted)]">
        No weekday data available
      </div>
    );
  }

  return (
    <div className="w-full h-64 md:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="day"
            stroke="var(--color-text-muted)"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: 'var(--color-border)' }}
          />
          <YAxis
            domain={[0, 100]}
            stroke="var(--color-text-muted)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `${val}%`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as WeekdayStat;
                return (
                  <div className="glass-heavy p-3 rounded-xl border border-[var(--color-border)] shadow-lg text-fluid-xs bg-[var(--color-surface)]">
                    <div className="font-bold mb-1" style={{ color: 'var(--color-text)' }}>{item.day}</div>
                    <div className="font-semibold text-[var(--color-primary)]">
                      {item.completionRate}% Average Rate
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="completionRate" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.completionRate >= 90
                    ? '#58684A' // Deep sage
                    : entry.completionRate >= 80
                    ? '#8B9A7B' // Primary sage
                    : entry.completionRate >= 70
                    ? '#A3B18A' // Light sage
                    : '#C5A059' // Warm amber/tan
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
