/** AreaChart component showing habit completion percentage trends over time (Corbel theme). */
import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { DailyTrendPoint } from '../types';

interface CompletionTrendChartProps {
  data: DailyTrendPoint[];
}

export const CompletionTrendChart: React.FC<CompletionTrendChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-[var(--color-text-muted)]">
        No trend data available
      </div>
    );
  }

  // Format short date for X-axis (e.g., "10/01")
  const formattedData = data.map((d) => ({
    ...d,
    shortDate: d.date.split('-').slice(1).join('/'),
  }));

  return (
    <div className="w-full h-64 md:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B9A7B" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#8B9A7B" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="shortDate"
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
                const item = payload[0].payload as DailyTrendPoint;
                return (
                  <div className="glass-heavy p-3 rounded-xl border border-[var(--color-border)] shadow-lg text-fluid-xs bg-[var(--color-surface)]">
                    <div className="font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                      {item.date} ({item.dayOfWeek})
                    </div>
                    <div className="font-semibold text-[var(--color-primary)]">
                      {item.completionRate}% Completion
                    </div>
                    <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                      {item.completed} of {item.total} habits finished
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="completionRate"
            stroke="#8B9A7B"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#trendGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
