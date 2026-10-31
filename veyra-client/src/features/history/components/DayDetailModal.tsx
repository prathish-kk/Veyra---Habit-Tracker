/** Modal displaying exact habits completed on a specific historical day. */
import React from 'react';
import { GlassButton } from '@/components/glass/GlassButton';
import { CheckCircle2, Clock, X, Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { DayHistory } from '../types';

interface DayDetailModalProps {
  day: DayHistory | null;
  onClose: () => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({ day, onClose }) => {
  if (!day) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75" onClick={onClose} />

      {/* Modal Card */}
      <div
        className="glass-heavy relative z-10 w-full max-w-md p-6 rounded-3xl border border-[var(--glass-border)] shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/15 text-primary">
              <Calendar size={18} />
            </div>
            <div>
              <h2 className="text-fluid-base font-bold text-gray-900 dark:text-white">
                {day.date} ({day.dayOfWeek})
              </h2>
              <p className="text-fluid-xs text-gray-600 dark:text-zinc-400">
                {day.completedCount} of {day.totalCount} habits completed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
          {day.tasks.map((task, idx) => (
            <div
              key={idx}
              className={cn(
                'p-3 rounded-xl border flex items-center justify-between text-fluid-xs',
                task.completed
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                  : 'bg-black/[0.02] dark:bg-white/5 border-[var(--glass-border)] text-gray-700 dark:text-zinc-400'
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-fluid-base">{task.emoji || '✨'}</span>
                <span className={cn('font-semibold', task.completed && 'line-through opacity-85')}>
                  {task.title}
                </span>
              </div>
              <div>
                {task.completed ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
                    <CheckCircle2 size={13} /> Completed
                  </span>
                ) : (
                  <span className="text-gray-400 dark:text-zinc-500 flex items-center gap-1 text-[11px]">
                    <Clock size={13} /> Missed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <GlassButton variant="ghost" onClick={onClose} className="w-full justify-center text-fluid-xs">
          Close
        </GlassButton>
      </div>
    </div>
  );
};
