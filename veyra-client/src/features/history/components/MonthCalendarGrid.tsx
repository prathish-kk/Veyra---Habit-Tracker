/** Month calendar grid showing daily habit check/cross indicators (Corbel theme). */
import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { DayHistory } from '../types';

interface MonthCalendarGridProps {
  days: DayHistory[];
  onSelectDay: (day: DayHistory) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MonthCalendarGrid: React.FC<MonthCalendarGridProps> = ({ days, onSelectDay }) => {
  if (days.length === 0) return null;

  // Compute offset for the first day of the month
  const firstDayOfWeek = new Date(days[0].date).getUTCDay();
  const blanks = Array.from({ length: firstDayOfWeek });

  return (
    <div className="w-full select-none">
      {/* Weekday Header */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-fluid-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="py-1">
            {wd}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="h-16 md:h-20 rounded-xl bg-transparent" />
        ))}

        {days.map((day) => {
          const isCompleted = day.status === 'completed';
          const isPartial = day.status === 'partial';

          return (
            <button
              key={day.date}
              type="button"
              onClick={() => onSelectDay(day)}
              className={cn(
                'h-16 md:h-20 p-2 rounded-xl border flex flex-col justify-between text-left transition-all hover:scale-105 hover:z-10 bg-[var(--color-surface)]',
                isCompleted
                  ? 'bg-[var(--color-primary-soft)]/50 border-[var(--color-primary)]/40 hover:border-[var(--color-primary)]'
                  : isPartial
                  ? 'bg-[var(--color-warning)]/10 border-[var(--color-warning)]/30 hover:border-[var(--color-warning)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-fluid-xs font-bold" style={{ color: 'var(--color-text)' }}>{day.dayNumber}</span>
                {isCompleted ? (
                  <span className="w-4 h-4 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center">
                    <Check size={11} strokeWidth={3} />
                  </span>
                ) : isPartial ? (
                  <span className="w-4 h-4 rounded-full bg-[var(--color-warning)] text-white flex items-center justify-center text-[10px] font-bold">
                    {day.completedCount}
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] flex items-center justify-center">
                    <X size={10} />
                  </span>
                )}
              </div>

              <div className="text-[10px] truncate" style={{ color: 'var(--color-text-muted)' }}>
                {day.completedCount} of {day.totalCount}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
