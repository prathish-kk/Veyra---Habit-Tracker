/** Daily tasks management page with date switcher, filters, progress ring, and modal (Corbel theme). */
import React, { useState, useMemo, useCallback } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlassButton } from '@/components/glass/GlassButton';
import {
  useDailyTasks,
  TaskItemCard,
  CreateTaskModal,
} from '@/features/daily-tasks';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sparkles,
  CheckCircle2,
  Lock,
  ListFilter,
} from 'lucide-react';
import { getIndianTodayDateString, shiftDateString } from '@/lib/date';

export const DailyTasksPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return getIndianTodayDateString();
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'missed'>('all');

  const {
    occurrences,
    summary,
    isLoading,
    toggleOccurrence,
    createTask,
    deleteTask,
  } = useDailyTasks(selectedDate);

  const todayStr = getIndianTodayDateString();
  const isToday = selectedDate === todayStr;
  const isPast = selectedDate < todayStr;

  const handlePrevDay = useCallback(() => {
    setSelectedDate((prev) => shiftDateString(prev, -1));
  }, []);

  const handleNextDay = useCallback(() => {
    setSelectedDate((prev) => shiftDateString(prev, 1));
  }, []);

  const handleJumpToToday = useCallback(() => {
    setSelectedDate(todayStr);
  }, [todayStr]);

  const checkIsMissed = useCallback(
    (occ: (typeof occurrences)[0]) => {
      if (occ.completed) return false;
      // Rule: A task is NOT marked as not done/missed until the day is completely over!
      if (selectedDate < todayStr) return true;
      return false;
    },
    [selectedDate, todayStr]
  );

  const missedCount = useMemo(() => {
    return summary.missedTasks !== undefined
      ? summary.missedTasks
      : occurrences.filter(checkIsMissed).length;
  }, [summary.missedTasks, occurrences, checkIsMissed]);

  const pendingCount = useMemo(() => {
    return occurrences.filter((o) => !o.completed && !checkIsMissed(o)).length;
  }, [occurrences, checkIsMissed]);

  const filteredOccurrences = useMemo(() => {
    return occurrences.filter((occ) => {
      const isMissed = checkIsMissed(occ);
      if (filter === 'pending') return !occ.completed && !isMissed;
      if (filter === 'completed') return occ.completed;
      if (filter === 'missed') return isMissed;
      return true;
    });
  }, [occurrences, checkIsMissed, filter]);

  const formattedDateTitle = useMemo(() => {
    return new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }, [selectedDate]);

  return (
    <AppShell>
      <PageHeader
        title="Daily Habits & Tasks"
        subtitle="Small consistent actions build extraordinary results."
      />

      {/* Date Navigation & Actions Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-1">
            <button
              onClick={handlePrevDay}
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
              title="Previous Day"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="px-3 py-1 flex items-center gap-1.5 text-fluid-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              <Calendar size={15} className="text-[var(--color-primary)]" />
              <span>{formattedDateTitle}</span>
              {isToday && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold ml-1">
                  TODAY
                </span>
              )}
            </div>
            <button
              onClick={handleNextDay}
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
              title="Next Day"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {!isToday && (
            <button
              onClick={handleJumpToToday}
              className="px-3 py-2 rounded-xl text-fluid-xs font-medium text-[var(--color-primary)] bg-[var(--color-primary-soft)] hover:opacity-90 border border-[var(--color-primary)]/30 transition-all"
            >
              Today
            </button>
          )}

          {isPast && (
            <span className="hidden md:inline-flex items-center gap-1 text-fluid-xs text-[var(--color-warning)] bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 px-2.5 py-1 rounded-lg">
              <Lock size={12} /> Read-only archive
            </span>
          )}
        </div>

        <GlassButton
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          className="flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          <span>New Habit</span>
        </GlassButton>
      </div>

      {/* Progress & Summary Bar */}
      <div className="glass p-5 rounded-2xl mb-6 border border-[var(--color-border)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="text-fluid-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Daily Progress</div>
            <div className="text-fluid-xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <span>{summary.completionPercentage}% Completed</span>
              {summary.completionPercentage === 100 && summary.totalTasks > 0 && (
                <span className="text-[var(--color-primary)] text-sm flex items-center gap-1">
                  <CheckCircle2 size={16} /> All Done!
                </span>
              )}
            </div>
          </div>
          <div className="text-fluid-sm flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
            <span>
              <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{summary.completedTasks}</span> done
            </span>
            {missedCount > 0 && (
              <span className="text-red-500 dark:text-red-400">
                · <span className="font-semibold">{missedCount}</span> missed
              </span>
            )}
            <span>
              of <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{summary.totalTasks}</span> total
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-[var(--color-surface-hover)] overflow-hidden relative border border-[var(--color-border)]">
          <div
            className="h-full rounded-full transition-all duration-500 bg-[var(--color-primary)]"
            style={{
              width: `${summary.completionPercentage}%`,
            }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-wrap gap-1 rounded-xl p-1 bg-[var(--color-surface)] border border-[var(--color-border)]">
          <button
            onClick={() => setFilter('all')}
            className={`py-1.5 px-3 rounded-lg text-fluid-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            All ({occurrences.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`py-1.5 px-3 rounded-lg text-fluid-xs font-medium transition-all ${
              filter === 'pending'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`py-1.5 px-3 rounded-lg text-fluid-xs font-medium transition-all ${
              filter === 'completed'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Completed ({summary.completedTasks})
          </button>
          <button
            onClick={() => setFilter('missed')}
            className={`py-1.5 px-3 rounded-lg text-fluid-xs font-medium transition-all ${
              filter === 'missed'
                ? 'bg-red-600 text-white shadow-sm'
                : missedCount > 0
                ? 'text-red-500 hover:text-red-600'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Missed ({missedCount})
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-fluid-xs" style={{ color: 'var(--color-text-muted)' }}>
          <ListFilter size={14} /> Showing {filteredOccurrences.length} items
        </div>
      </div>

      {/* Task List */}
      {isLoading ? (
        <div className="glass p-12 text-center rounded-2xl border border-[var(--color-border)]">
          <div className="inline-block w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-fluid-sm" style={{ color: 'var(--color-text-muted)' }}>Loading habits for {formattedDateTitle}...</p>
        </div>
      ) : filteredOccurrences.length > 0 ? (
        <div className="space-y-3">
          {filteredOccurrences.map((occ) => (
            <TaskItemCard
              key={occ.id}
              occurrence={occ}
              onToggle={toggleOccurrence}
              onDelete={deleteTask}
              isReadOnly={isPast}
            />
          ))}
        </div>
      ) : (
        <div className="glass p-10 md:p-12 text-center rounded-2xl border border-[var(--color-border)]">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center mx-auto mb-4">
            <Sparkles size={28} />
          </div>
          <h3 className="text-fluid-base font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            {occurrences.length === 0 ? 'No habits scheduled for this day' : 'No habits match this filter'}
          </h3>
          <p className="text-fluid-xs max-w-sm mx-auto mb-5" style={{ color: 'var(--color-text-muted)' }}>
            {occurrences.length === 0
              ? 'Start building your streak today! Create your first recurring habit and track your daily growth.'
              : 'Try switching filters to view your other habits.'}
          </p>
          {occurrences.length === 0 && (
            <GlassButton onClick={() => setIsModalOpen(true)} variant="primary" className="mx-auto">
              <Plus size={16} />
              <span>Create Your First Habit</span>
            </GlassButton>
          )}
        </div>
      )}

      {/* Creation Modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createTask}
      />
    </AppShell>
  );
};
