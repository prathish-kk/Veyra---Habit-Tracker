/** Month snapshot card for archive history browsing. */
import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Unlock, ArrowRight, CheckCircle2, Award } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { MonthNode } from '../types';

interface MonthCardProps {
  month: MonthNode;
}

export const MonthCard: React.FC<MonthCardProps> = ({ month }) => {
  const { year, month: monthNum, monthName, isLocked, tasksCompleted, totalTasks, completionRate, xpEarned } =
    month;

  return (
    <div className="glass p-5 rounded-2xl border border-[var(--glass-border)] hover:border-primary/40 transition-all flex flex-col justify-between select-none group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-fluid-xs font-semibold text-gray-600 dark:text-zinc-400">
            {monthName} {year}
          </span>
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1',
              isLocked
                ? 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-300 border-zinc-500/20'
                : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25'
            )}
          >
            {isLocked ? (
              <>
                <Lock size={10} />
                <span>Locked Archive</span>
              </>
            ) : (
              <>
                <Unlock size={10} />
                <span>Active Month</span>
              </>
            )}
          </span>
        </div>

        <h3 className="text-fluid-xl font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors mb-2">
          {monthName}
        </h3>

        {/* Progress Bar & Rate */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-fluid-xs mb-1.5">
            <span className="text-gray-600 dark:text-zinc-400">Completion Rate</span>
            <span className="font-bold text-primary">{completionRate}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                completionRate >= 90
                  ? 'bg-emerald-500'
                  : 'bg-primary'
              )}
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-[var(--glass-border)] text-center text-fluid-xs mb-4">
          <div>
            <div className="text-[10px] uppercase font-semibold text-gray-500 dark:text-zinc-400">Habits</div>
            <div className="font-bold text-gray-900 dark:text-white mt-0.5">
              {tasksCompleted} <span className="text-gray-400 dark:text-zinc-500 font-normal">/ {totalTasks}</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-amber-600 dark:text-yellow-400">XP Earned</div>
            <div className="font-bold text-gray-900 dark:text-white mt-0.5">+{xpEarned}</div>
          </div>
        </div>
      </div>

      <Link
        to={`/history/${year}/${monthNum}`}
        className="w-full py-2 px-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-primary/20 text-gray-800 dark:text-zinc-200 hover:text-gray-900 dark:hover:text-white border border-[var(--glass-border)] hover:border-primary/40 text-fluid-xs font-semibold transition-all flex items-center justify-center gap-1.5"
      >
        <span>View Month Breakdown</span>
        <ArrowRight size={13} />
      </Link>
    </div>
  );
};
