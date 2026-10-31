import React from 'react';
import { Check, Trash2, Calendar, Lock, Clock, AlertCircle, X } from 'lucide-react';
import type { TaskOccurrence } from '../types';
import { getIndianTodayDateString } from '@/lib/date';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';

interface TaskItemCardProps {
  occurrence: TaskOccurrence;
  onToggle: (occurrenceId: string, completed?: boolean) => void;
  onDelete?: (taskId: string) => void;
  isReadOnly?: boolean;
}

export const TaskItemCard: React.FC<TaskItemCardProps> = React.memo(({
  occurrence,
  onToggle,
  onDelete,
  isReadOnly = false,
}) => {
  const { completed, task } = occurrence;
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const effectiveDueTime = occurrence.effectiveDueTime || occurrence.task?.dueTime || null;
  const todayStr = getIndianTodayDateString();
  const isDayOver = occurrence.date < todayStr;

  // Rule 1: A task is NEVER marked as not done/missed until the day is completely over!
  const isMissed = !completed && isDayOver;

  // Rule 2: If due time has passed today, allow completion with late points (+5 XP)
  const isLateToday = React.useMemo(() => {
    if (completed || isDayOver || !effectiveDueTime) return false;
    if (occurrence.date !== todayStr) return false;
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();
    const [h, m] = effectiveDueTime.split(':').map(Number);
    return currentMin > h * 60 + m;
  }, [completed, isDayOver, occurrence.date, effectiveDueTime, todayStr]);

  const isUrgent = React.useMemo(() => {
    if (completed || isMissed || isLateToday || !effectiveDueTime) return false;
    if (occurrence.date !== todayStr) return false;
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();
    const [h, m] = effectiveDueTime.split(':').map(Number);
    const diff = h * 60 + m - currentMin;
    return diff >= 0 && diff <= 60;
  }, [completed, isMissed, isLateToday, occurrence.date, effectiveDueTime, todayStr]);

  // Build card styles using CSS variables
  const cardStyle: React.CSSProperties = completed
    ? {
        borderColor: 'color-mix(in srgb, var(--color-success) 30%, transparent)',
        background: 'color-mix(in srgb, var(--color-success) 5%, var(--color-surface))',
      }
    : isMissed
    ? {
        borderColor: 'color-mix(in srgb, var(--color-danger) 30%, transparent)',
        background: 'color-mix(in srgb, var(--color-danger) 5%, var(--color-surface))',
      }
    : isLateToday
    ? {
        borderColor: 'color-mix(in srgb, var(--color-warning) 30%, transparent)',
        background: 'color-mix(in srgb, var(--color-warning) 5%, var(--color-surface))',
      }
    : {
        borderColor: 'var(--color-border)',
        background: 'var(--color-surface)',
      };

  // Rule 3: Past entries are locked and cannot be changed after the day is over
  const canToggle = !isReadOnly && !isDayOver;

  const checkboxStyle: React.CSSProperties = completed
    ? { background: 'var(--color-success)', color: '#fff' }
    : isMissed
    ? {
        border: '1px solid color-mix(in srgb, var(--color-danger) 40%, transparent)',
        background: 'color-mix(in srgb, var(--color-danger) 10%, transparent)',
        color: 'var(--color-danger)',
        cursor: 'not-allowed',
      }
    : isDayOver || isReadOnly
    ? {
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface-hover)',
        opacity: 0.5,
        cursor: 'not-allowed',
      }
    : isLateToday
    ? {
        border: '1px solid color-mix(in srgb, var(--color-warning) 50%, transparent)',
        background: 'color-mix(in srgb, var(--color-warning) 10%, transparent)',
      }
    : {
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface-hover)',
      };

  const checkboxTitle = isDayOver || isReadOnly
    ? 'Historical entries are locked after the day is over'
    : isLateToday
    ? `Due time passed (${effectiveDueTime}). Complete today for +5 XP`
    : completed
    ? 'Mark incomplete'
    : 'Mark complete (+15 XP)';

  return (
    <div
      className="glass p-4 rounded-xl transition-all duration-200 flex items-center justify-between gap-3 border"
      style={cardStyle}
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {/* Interactive Checkbox */}
        <button
          type="button"
          onClick={() => canToggle && onToggle(occurrence.id, !completed)}
          disabled={!canToggle}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0 active:scale-95"
          style={checkboxStyle}
          title={checkboxTitle}
          aria-label={checkboxTitle}
        >
          {completed ? (
            <Check size={16} strokeWidth={3} />
          ) : isMissed ? (
            <X size={14} strokeWidth={2.5} />
          ) : isDayOver || isReadOnly ? (
            <Lock size={12} style={{ color: 'var(--color-text-muted)' }} />
          ) : null}
        </button>

        {/* Task Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base select-none shrink-0">{task?.emoji || '✨'}</span>
            <span
              className="text-fluid-sm font-medium truncate"
              style={{
                color: completed
                  ? 'var(--color-text-muted)'
                  : isMissed
                  ? 'color-mix(in srgb, var(--color-danger) 70%, var(--color-text))'
                  : 'var(--color-text)',
                textDecoration: completed ? 'line-through' : 'none',
              }}
            >
              {task?.title || 'Daily Habit'}
            </span>
          </div>

          {task?.description && (
            <p className="text-fluid-xs mt-0.5 truncate pl-6" style={{ color: 'var(--color-text-muted)' }}>{task.description}</p>
          )}
        </div>
      </div>

      {/* Trailing badges / actions */}
      <div className="flex items-center gap-2 shrink-0">
        {completed ? (
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{
              background: 'color-mix(in srgb, var(--color-success) 15%, transparent)',
              color: 'var(--color-success)',
              border: '1px solid color-mix(in srgb, var(--color-success) 25%, transparent)',
            }}
          >
            {occurrence.xpAwarded === 5 ? '+5 XP (Late)' : `+${occurrence.xpAwarded || 15} XP`}
          </span>
        ) : isMissed ? (
          <span
            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"
            style={{
              background: 'color-mix(in srgb, var(--color-danger) 12%, transparent)',
              color: 'var(--color-danger)',
              border: '1px solid color-mix(in srgb, var(--color-danger) 25%, transparent)',
            }}
          >
            <AlertCircle size={11} /> Missed (Day Ended)
          </span>
        ) : isLateToday ? (
          <span
            className="text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1"
            style={{
              background: 'color-mix(in srgb, var(--color-warning) 10%, transparent)',
              color: 'var(--color-warning)',
              border: '1px solid color-mix(in srgb, var(--color-warning) 25%, transparent)',
            }}
          >
            <Clock size={11} /> Due {effectiveDueTime} • Late (+5 XP)
          </span>
        ) : isUrgent ? (
          <span
            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse"
            style={{
              background: 'color-mix(in srgb, var(--color-warning) 15%, transparent)',
              color: 'var(--color-warning)',
              border: '1px solid color-mix(in srgb, var(--color-warning) 25%, transparent)',
            }}
          >
            <Clock size={11} /> Due {effectiveDueTime} (+15 XP)
          </span>
        ) : effectiveDueTime ? (
          <span
            className="text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1"
            style={{
              background: 'var(--color-primary-soft)',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <Clock size={11} /> Due {effectiveDueTime} (+15 XP)
          </span>
        ) : (
          <span
            className="text-[11px] px-2 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1"
            style={{
              background: 'var(--color-surface-hover)',
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
            }}
          >
            <Calendar size={10} /> Daily (+15 XP)
          </span>
        )}

        {onDelete && !isReadOnly && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteModal(true);
            }}
            className="p-1.5 rounded-lg transition-colors"
            title="Delete habit"
            aria-label="Delete habit"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Confirmation Modal before deleting */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Delete Habit?"
        itemName={task?.title || 'Daily Habit'}
        itemType="habit"
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          const idToDelete = task?.id || occurrence.taskId;
          if (idToDelete && onDelete) onDelete(idToDelete);
          setShowDeleteModal(false);
        }}
      />
    </div>
  );
});

TaskItemCard.displayName = 'TaskItemCard';
