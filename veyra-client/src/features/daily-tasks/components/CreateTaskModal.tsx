/** Modal to create a recurring daily habit or task with end time / deadline (Corbel theme). */
import React, { useState } from 'react';
import { GlassButton } from '@/components/glass/GlassButton';
import { GlassInput } from '@/components/glass/GlassInput';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import type { CreateTaskPayload } from '../types';
import { DailyTimeSelector } from './DailyTimeSelector';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTaskPayload) => Promise<unknown>;
}

const EMOJI_OPTIONS = ['✨', '🧘', '🏃', '📚', '💧', '🥗', '💻', '🎨', '✍️', '🛌', '🚶', '🎯'];
const DAYS = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('✨');
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [hasEndTime, setHasEndTime] = useState(true);
  const [dueTime, setDueTime] = useState('21:00');
  const [customizePerDay, setCustomizePerDay] = useState(false);
  const [dayDueTimes, setDayDueTimes] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length === 1) return; // Must keep at least one day
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day].sort());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a habit name');
      return;
    }

    let formattedDayDueTimes: Record<string, string> | null = null;
    if (hasEndTime) {
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(dueTime)) {
        setError('Please provide a valid deadline in HH:mm format (e.g. 21:00)');
        return;
      }
      if (customizePerDay) {
        formattedDayDueTimes = {};
        for (const d of selectedDays) {
          const t = dayDueTimes[d] || dueTime;
          if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(t)) {
            setError(`Please provide a valid time for ${DAYS.find((item) => item.value === d)?.label || 'day'}`);
            return;
          }
          formattedDayDueTimes[String(d)] = t;
        }
      }
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        emoji: selectedEmoji,
        daysOfWeek: selectedDays,
        dueTime: hasEndTime ? dueTime : null,
        dayDueTimes: hasEndTime && customizePerDay ? formattedDayDueTimes : null,
        isRecurring: true,
      });
      setTitle('');
      setDescription('');
      setSelectedEmoji('✨');
      setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
      setHasEndTime(true);
      setDueTime('21:00');
      setCustomizePerDay(false);
      setDayDueTimes({});
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="glass p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl relative border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-[var(--color-surface)] pb-2 border-b border-[var(--color-border)] z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl">{selectedEmoji}</span>
            <h2 className="text-fluid-lg font-bold" style={{ color: 'var(--color-text)' }}>
              Create New Habit
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-fluid-xs bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <GlassInput
            label="Habit Name"
            placeholder="e.g. Read 20 pages, 10 min Meditation..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />

          <div>
            <label className="block text-fluid-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
              Choose Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                    selectedEmoji === emoji
                      ? 'bg-[var(--color-primary-soft)] border border-[var(--color-primary)] scale-110 shadow-sm'
                      : 'bg-[var(--color-surface-hover)] hover:bg-[var(--color-surface)] border border-[var(--color-border)]'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-fluid-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
              Description / Intention (Optional)
            </label>
            <textarea
              className="glass-input w-full p-2.5 rounded-xl text-fluid-sm resize-none h-16"
              placeholder="Why does this habit matter to you?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-fluid-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
              Repeat on Days
            </label>
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((day) => {
                const isSelected = selectedDays.includes(day.value);
                return (
                  <button
                    type="button"
                    key={day.value}
                    onClick={() => toggleDay(day.value)}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                      isSelected
                        ? 'bg-[var(--color-primary)] text-white shadow-sm'
                        : 'bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Time Selector */}
          <DailyTimeSelector
            hasEndTime={hasEndTime}
            onToggleHasEndTime={setHasEndTime}
            dueTime={dueTime}
            onDueTimeChange={setDueTime}
            selectedDays={selectedDays}
            customizePerDay={customizePerDay}
            onToggleCustomizePerDay={setCustomizePerDay}
            dayDueTimes={dayDueTimes}
            onDayDueTimesChange={setDayDueTimes}
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-fluid-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              Cancel
            </button>
            <GlassButton type="submit" variant="primary" disabled={isSubmitting} className="min-w-[120px]">
              <Sparkles size={16} />
              <span>{isSubmitting ? 'Creating...' : 'Create Habit'}</span>
            </GlassButton>
          </div>
        </form>
      </div>
    </div>
  );
};
