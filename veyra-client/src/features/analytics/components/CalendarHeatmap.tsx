/** Habit completion calendar heatmap grid (Corbel theme with sage green levels). */
import React from 'react';
import { cn } from '@/lib/cn';
import type { HeatmapDay } from '../types';

interface CalendarHeatmapProps {
  data: HeatmapDay[];
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ data }) => {
  const getLevelColor = (level: number) => {
    switch (level) {
      case 4:
        return 'bg-[#58684A] border-[#47543C] shadow-sm';
      case 3:
        return 'bg-[#8B9A7B] border-[#7A896A] shadow-sm';
      case 2:
        return 'bg-[#A3B18A]/70 border-[#8B9A7B]/50';
      case 1:
        return 'bg-[#A3B18A]/30 border-[#A3B18A]/40';
      default:
        return 'bg-[var(--color-surface-hover)] border-[var(--color-border)]';
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-x-auto">
        {data.map((day, idx) => (
          <div
            key={idx}
            className={cn(
              'w-4 h-4 md:w-5 md:h-5 rounded-md border transition-all duration-200 hover:scale-125 cursor-pointer',
              getLevelColor(day.level)
            )}
            title={`${day.date}: ${day.count} habits completed (Level ${day.level})`}
          />
        ))}
      </div>

      {/* Legend Footer */}
      <div className="flex items-center justify-end gap-2 mt-3 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((lvl) => (
          <span
            key={lvl}
            className={cn('w-3.5 h-3.5 rounded border', getLevelColor(lvl))}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};
