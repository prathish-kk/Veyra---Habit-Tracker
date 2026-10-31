/** Monthly history snapshot detail page — full calendar breakdown, reflection, and daily habits. */
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { useMonthSnapshot, MonthCalendarGrid, DayDetailModal } from '@/features/history';
import type { DayHistory } from '@/features/history/types';
import {
  ArrowLeft,
  Lock,
  Unlock,
  CheckCircle2,
  Award,
  Flame,
  Calendar,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export const HistoryMonthPage: React.FC = () => {
  const { year = '2026', month = '10' } = useParams<{ year: string; month: string }>();
  const numYear = parseInt(year, 10);
  const numMonth = parseInt(month, 10);

  const { snapshot, isLoading, isError } = useMonthSnapshot(numYear, numMonth);
  const [selectedDay, setSelectedDay] = useState<DayHistory | null>(null);

  if (isLoading) {
    return (
      <AppShell>
        <div className="py-4">
          <div className="h-6 w-32 rounded-lg bg-white/10 animate-pulse mb-6" />
          <div className="h-10 w-64 rounded-xl bg-white/10 animate-pulse mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass p-5 rounded-2xl border border-white/5 h-24 animate-pulse" />
            ))}
          </div>
          <div className="glass p-6 rounded-3xl border border-white/5 h-96 animate-pulse" />
        </div>
      </AppShell>
    );
  }

  if (isError || !snapshot) {
    return (
      <AppShell>
        <div className="py-12 text-center">
          <Calendar size={48} className="mx-auto text-gray-400 dark:text-zinc-600 mb-3" />
          <h2 className="text-fluid-lg font-bold text-gray-900 dark:text-white mb-2">Month Snapshot Not Found</h2>
          <p className="text-fluid-xs text-gray-600 dark:text-zinc-400 mb-6">
            Could not find an archive snapshot for {month}/{year}.
          </p>
          <Link
            to="/history"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-fluid-xs font-semibold transition-all shadow-md"
          >
            <ArrowLeft size={16} /> Return to History
          </Link>
        </div>
      </AppShell>
    );
  }

  const {
    monthName,
    isLocked,
    tasksCompleted,
    totalTasks,
    completionRate,
    xpEarned,
    streakDays,
    reflection,
    days,
  } = snapshot;

  return (
    <AppShell>
      {/* Top Navigation */}
      <div className="mb-4">
        <Link
          to="/history"
          className="inline-flex items-center gap-1.5 text-fluid-xs text-gray-500 dark:text-zinc-400 hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft size={14} /> Back to Archives
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-fluid-2xl font-black text-gray-900 dark:text-white">
              {monthName} {numYear} Snapshot
            </h1>
            <span
              className={cn(
                'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1',
                isLocked
                  ? 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-300 border-zinc-500/20'
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25'
              )}
            >
              {isLocked ? (
                <>
                  <Lock size={10} /> Locked Archive
                </>
              ) : (
                <>
                  <Unlock size={10} /> Active Month
                </>
              )}
            </span>
          </div>
          <p className="text-fluid-xs text-gray-600 dark:text-zinc-400">
            {isLocked
              ? 'This month has ended and is permanently archived with immutable records.'
              : 'Live active month. Occurrences update dynamically in real time.'}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="glass p-4 rounded-2xl border border-primary/20 bg-primary/5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Completion Rate
          </div>
          <div className="text-fluid-2xl font-black text-gray-900 dark:text-white mt-1">{completionRate}%</div>
          <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 mt-2 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="glass p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
            Habits Completed
          </div>
          <div className="text-fluid-2xl font-black text-gray-900 dark:text-white mt-1">
            {tasksCompleted}{' '}
            <span className="text-fluid-xs font-normal text-gray-500 dark:text-zinc-400">/ {totalTasks}</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
            <CheckCircle2 size={12} /> Total logged
          </div>
        </div>

        <div className="glass p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-yellow-300">
            XP Earned
          </div>
          <div className="text-fluid-2xl font-black text-gray-900 dark:text-white mt-1">+{xpEarned}</div>
          <div className="text-[11px] text-amber-600 dark:text-yellow-400 mt-2 flex items-center gap-1">
            <Award size={12} /> Milestone rewards
          </div>
        </div>

        <div className="glass p-4 rounded-2xl border border-orange-500/20 bg-orange-500/5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-300">
            Best Streak
          </div>
          <div className="text-fluid-2xl font-black text-gray-900 dark:text-white mt-1">
            {streakDays} <span className="text-fluid-xs font-normal text-gray-500 dark:text-zinc-400">days</span>
          </div>
          <div className="text-[11px] text-orange-500 dark:text-orange-400 mt-2 flex items-center gap-1">
            <Flame size={12} /> Monthly streak
          </div>
        </div>
      </div>

      {/* Monthly Reflection Section */}
      <div className="glass p-5 rounded-2xl border border-[var(--glass-border)] mb-6">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={16} className="text-primary" />
          <h2 className="text-fluid-base font-bold text-gray-900 dark:text-white">Monthly Reflection & Notes</h2>
        </div>
        {reflection ? (
          <p className="text-fluid-xs text-gray-800 dark:text-zinc-300 italic bg-black/[0.02] dark:bg-white/5 p-4 rounded-xl border border-[var(--glass-border)] leading-relaxed">
            "{reflection}"
          </p>
        ) : (
          <p className="text-fluid-xs text-gray-600 dark:text-zinc-400">
            No reflection recorded for this month. You can add reflections in your{' '}
            <Link to="/monthly" className="text-primary hover:underline">
              Monthly Goals
            </Link>{' '}
            page before the month closes.
          </p>
        )}
      </div>

      {/* Calendar Day-by-Day Grid */}
      <div className="glass p-5 md:p-6 rounded-3xl border border-[var(--glass-border)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <h2 className="text-fluid-lg font-bold text-gray-900 dark:text-white">Day-by-Day Habit Log</h2>
            <p className="text-fluid-xs text-gray-600 dark:text-zinc-400">
              Click any calendar day to inspect the specific habits checked off or missed.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Partial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-400 dark:bg-zinc-600" />
              <span>Missed / Inactive</span>
            </div>
          </div>
        </div>

        <MonthCalendarGrid days={days} onSelectDay={setSelectedDay} />
      </div>

      {/* Day Details Modal */}
      <DayDetailModal day={selectedDay} onClose={() => setSelectedDay(null)} />
    </AppShell>
  );
};
