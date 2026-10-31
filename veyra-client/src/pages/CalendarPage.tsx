/** Comprehensive interactive calendar view for habits and daily completion history (Corbel theme). */
import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { useMonthSnapshot, MonthCalendarGrid, DayDetailModal } from '@/features/history';
import type { DayHistory } from '@/features/history/types';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentYearAndMonth } from '@/lib/date';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const CalendarPage: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(() => getCurrentYearAndMonth().year);
  const [currentMonth, setCurrentMonth] = useState<number>(() => getCurrentYearAndMonth().month);
  const [selectedDay, setSelectedDay] = useState<DayHistory | null>(null);

  const { snapshot, isLoading } = useMonthSnapshot(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleGoToday = () => {
    const { year, month } = getCurrentYearAndMonth();
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  const monthName = MONTH_NAMES[currentMonth - 1];
  const days = snapshot?.days ?? [];

  return (
    <AppShell>
      <PageHeader
        title="Habit Calendar"
        subtitle="Visualize your daily consistency, explore habit streaks, and inspect any day's accomplishments."
      />

      {/* Month Navigation & Control Bar */}
      <div className="glass p-4 rounded-2xl border border-[var(--color-border)] mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <CalendarIcon size={22} />
          </div>
          <div>
            <h2 className="text-fluid-xl font-black" style={{ color: 'var(--color-text)' }}>
              {monthName} {currentYear}
            </h2>
            <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
              {snapshot ? `${snapshot.completionRate}% average habit completion` : 'Loading...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGoToday}
            className="px-3 py-1.5 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text)] border border-[var(--color-border)] text-fluid-xs font-semibold transition-all"
          >
            Today
          </button>
          <div className="flex items-center gap-1 bg-[var(--color-surface)] p-1 rounded-xl border border-[var(--color-border)]">
            <button
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextMonth}
              aria-label="Next Month"
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Month Quick Stats */}
      {snapshot && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="glass p-3.5 rounded-2xl border border-[var(--color-border)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
              Completed Habits
            </span>
            <div className="text-fluid-xl font-bold mt-0.5" style={{ color: 'var(--color-text)' }}>
              {snapshot.tasksCompleted}{' '}
              <span className="text-fluid-xs font-normal" style={{ color: 'var(--color-text-muted)' }}>/ {snapshot.totalTasks}</span>
            </div>
          </div>

          <div className="glass p-3.5 rounded-2xl border border-[var(--color-border)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
              Success Rate
            </span>
            <div className="text-fluid-xl font-bold mt-0.5" style={{ color: 'var(--color-text)' }}>
              {snapshot.completionRate}%
            </div>
          </div>

          <div className="glass p-3.5 rounded-2xl border border-[var(--color-border)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-warning)]">
              XP Earned
            </span>
            <div className="text-fluid-xl font-bold mt-0.5" style={{ color: 'var(--color-text)' }}>+{snapshot.xpEarned}</div>
          </div>

          <div className="glass p-3.5 rounded-2xl border border-[var(--color-border)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-warning)]">
              Monthly Streak
            </span>
            <div className="text-fluid-xl font-bold mt-0.5" style={{ color: 'var(--color-text)' }}>
              {snapshot.streakDays} <span className="text-fluid-xs font-normal" style={{ color: 'var(--color-text-muted)' }}>days</span>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Grid Box */}
      <div className="glass p-5 md:p-6 rounded-3xl border border-[var(--color-border)] mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div className="text-fluid-xs" style={{ color: 'var(--color-text-muted)' }}>
            Click on any day cell to view completed habits, timestamps, and notes.
          </div>
          <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />
              <span>All done</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-warning)]" />
              <span>Partial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-border)]" />
              <span>None</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="h-96 rounded-2xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] animate-pulse flex items-center justify-center text-fluid-xs" style={{ color: 'var(--color-text-muted)' }}>
            Loading calendar days...
          </div>
        ) : (
          <MonthCalendarGrid days={days} onSelectDay={setSelectedDay} />
        )}
      </div>

      {/* Archive link footer banner */}
      <div className="glass p-4 rounded-2xl border border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[var(--color-primary)]" />
          <span className="text-fluid-xs" style={{ color: 'var(--color-text)' }}>
            Want to see archived snapshots of past years and months?
          </span>
        </div>
        <Link
          to="/history"
          className="text-fluid-xs font-semibold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
        >
          Open Archives <ArrowRight size={13} />
        </Link>
      </div>

      {/* Day Details Modal */}
      <DayDetailModal day={selectedDay} onClose={() => setSelectedDay(null)} />
    </AppShell>
  );
};
