/**
 * DailyTimeSelector — Interactive time adder for daily tasks and habits (Corbel theme).
 * Features atmospheric time-of-day presets, digital tuner, quick stepping,
 * per-day schedule matrix, and deadline rule preview.
 */
import React, { useState, useMemo, useCallback } from 'react';
import {
  Clock,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Copy,
  RotateCcw,
  Check,
  Calendar,
  Zap,
  type LucideIcon,
} from 'lucide-react';

interface DailyTimeSelectorProps {
  hasEndTime: boolean;
  onToggleHasEndTime: (enabled: boolean) => void;
  dueTime: string; // HH:mm
  onDueTimeChange: (time: string) => void;
  selectedDays: number[];
  customizePerDay: boolean;
  onToggleCustomizePerDay: (enabled: boolean) => void;
  dayDueTimes: Record<number, string>;
  onDayDueTimesChange: (dayTimes: Record<number, string>) => void;
}

const DAYS_META = [
  { label: 'Sun', value: 0, full: 'Sunday' },
  { label: 'Mon', value: 1, full: 'Monday' },
  { label: 'Tue', value: 2, full: 'Tuesday' },
  { label: 'Wed', value: 3, full: 'Wednesday' },
  { label: 'Thu', value: 4, full: 'Thursday' },
  { label: 'Fri', value: 5, full: 'Friday' },
  { label: 'Sat', value: 6, full: 'Saturday' },
];

interface PresetTime {
  id: string;
  label: string;
  time: string;
  time12: string;
  tagline: string;
  icon: LucideIcon;
}

const PRESETS: PresetTime[] = [
  {
    id: 'morning',
    label: 'Morning',
    time: '09:00',
    time12: '9:00 AM',
    tagline: 'Start early',
    icon: Sunrise,
  },
  {
    id: 'midday',
    label: 'Midday',
    time: '13:00',
    time12: '1:00 PM',
    tagline: 'Lunch reset',
    icon: Sun,
  },
  {
    id: 'evening',
    label: 'Evening',
    time: '18:00',
    time12: '6:00 PM',
    tagline: 'Post workday',
    icon: Sunset,
  },
  {
    id: 'night',
    label: 'Night',
    time: '21:00',
    time12: '9:00 PM',
    tagline: 'Evening routine',
    icon: Moon,
  },
  {
    id: 'midnight',
    label: 'Midnight',
    time: '23:59',
    time12: '11:59 PM',
    tagline: 'Full day window',
    icon: Sparkles,
  },
];

/** Convert HH:mm to 12h formatted string (e.g. 9:00 PM) */
function format12h(timeStr: string): string {
  if (!timeStr || !timeStr.includes(':')) return timeStr;
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = String(m).padStart(2, '0');
  return `${displayH}:${displayM} ${period}`;
}

/** Compute relative time description from now */
function getRelativeRemainingText(dueTimeStr: string): string {
  if (!dueTimeStr || !dueTimeStr.includes(':')) return '';
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const [h, m] = dueTimeStr.split(':').map(Number);
  const dueMin = h * 60 + m;
  const diff = dueMin - currentMin;

  if (diff < 0) {
    const passed = Math.abs(diff);
    const hrs = Math.floor(passed / 60);
    const mins = passed % 60;
    return `Deadline passed ${hrs > 0 ? `${hrs}h ` : ''}${mins}m ago today`;
  } else if (diff === 0) {
    return 'Deadline is right now';
  } else {
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m remaining today`;
  }
}

export const DailyTimeSelector: React.FC<DailyTimeSelectorProps> = ({
  hasEndTime,
  onToggleHasEndTime,
  dueTime,
  onDueTimeChange,
  selectedDays,
  customizePerDay,
  onToggleCustomizePerDay,
  dayDueTimes,
  onDayDueTimesChange,
}) => {
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Parse hours and minutes from dueTime (HH:mm)
  const { hour24, minute } = useMemo(() => {
    if (!dueTime || !dueTime.includes(':')) return { hour24: 21, minute: 0 };
    const [h, m] = dueTime.split(':').map(Number);
    return { hour24: isNaN(h) ? 21 : h, minute: isNaN(m) ? 0 : m };
  }, [dueTime]);

  const isPM = hour24 >= 12;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  // Handlers for adjustments
  const updateHour = useCallback(
    (delta: number) => {
      let nextH = (hour24 + delta) % 24;
      if (nextH < 0) nextH += 24;
      const formatted = `${String(nextH).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      onDueTimeChange(formatted);
    },
    [hour24, minute, onDueTimeChange]
  );

  const updateMinute = useCallback(
    (delta: number) => {
      let nextM = (minute + delta) % 60;
      if (nextM < 0) nextM += 60;
      const formatted = `${String(hour24).padStart(2, '0')}:${String(nextM).padStart(2, '0')}`;
      onDueTimeChange(formatted);
    },
    [hour24, minute, onDueTimeChange]
  );

  const togglePeriod = useCallback(() => {
    const nextH = isPM ? hour24 - 12 : hour24 + 12;
    const formatted = `${String(nextH).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    onDueTimeChange(formatted);
  }, [hour24, minute, isPM, onDueTimeChange]);

  const handleSetMinute = useCallback(
    (newMin: number) => {
      const formatted = `${String(hour24).padStart(2, '0')}:${String(newMin).padStart(2, '0')}`;
      onDueTimeChange(formatted);
    },
    [hour24, onDueTimeChange]
  );

  const handleDayTimeChange = useCallback(
    (dayValue: number, timeVal: string) => {
      onDayDueTimesChange({
        ...dayDueTimes,
        [dayValue]: timeVal,
      });
    },
    [dayDueTimes, onDayDueTimesChange]
  );

  const applyToAllDays = useCallback(() => {
    const nextMap: Record<number, string> = {};
    for (const d of selectedDays) {
      nextMap[d] = dueTime;
    }
    onDayDueTimesChange(nextMap);
    setCopyFeedback(`Applied ${format12h(dueTime)} to all active days`);
    setTimeout(() => setCopyFeedback(null), 2500);
  }, [selectedDays, dueTime, onDayDueTimesChange]);

  const applyWeekdayWeekendPreset = useCallback(
    (weekdayTime: string, weekendTime: string) => {
      const nextMap: Record<number, string> = {};
      for (const d of selectedDays) {
        if (d === 0 || d === 6) {
          nextMap[d] = weekendTime;
        } else {
          nextMap[d] = weekdayTime;
        }
      }
      onDayDueTimesChange(nextMap);
      setCopyFeedback(`Weekdays ${format12h(weekdayTime)}, Weekends ${format12h(weekendTime)}`);
      setTimeout(() => setCopyFeedback(null), 2500);
    },
    [selectedDays, onDayDueTimesChange]
  );

  const relativeText = useMemo(() => getRelativeRemainingText(dueTime), [dueTime]);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 space-y-4 shadow-sm transition-all duration-300">
      {/* Header Bar with Master Toggle */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              hasEndTime
                ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] border border-[var(--color-primary)]/40'
                : 'bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
            }`}
          >
            <Clock size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-fluid-sm font-bold tracking-wide" style={{ color: 'var(--color-text)' }}>
                Daily Deadline / Cut-off
              </span>
              {hasEndTime ? (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] border border-[var(--color-primary)]/30">
                  Strict
                </span>
              ) : (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]">
                  Flexible
                </span>
              )}
            </div>
            <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
              {hasEndTime
                ? 'Complete before deadline or marked as missed'
                : 'No strict cut-off time (anytime before midnight)'}
            </p>
          </div>
        </div>

        {/* Master Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hasEndTime}
            onChange={(e) => onToggleHasEndTime(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-[var(--color-surface-hover)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-[var(--color-primary)] border border-[var(--color-border)]"></div>
        </label>
      </div>

      {hasEndTime && (
        <div className="space-y-4 pt-1 animate-fade-in">
          {/* Quick Time Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Quick Time Presets
              </span>
              <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Pick a daily anchor</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PRESETS.map((preset) => {
                const Icon = preset.icon;
                const isSelected = dueTime === preset.time;
                return (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => onDueTimeChange(preset.time)}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] shadow-sm'
                        : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)] bg-[var(--color-surface)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected ? 'text-[var(--color-primary)] bg-[var(--color-surface)]' : 'text-[var(--color-text-muted)] bg-[var(--color-surface-hover)]'
                        }`}
                      >
                        <Icon size={15} />
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-sm">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <div className="font-semibold text-xs truncate" style={{ color: 'var(--color-text)' }}>
                      {preset.label}
                    </div>
                    <div className="text-[11px] font-mono font-medium" style={{ color: 'var(--color-text-muted)' }}>
                      {preset.time12}
                    </div>
                    <div className="text-[9px] truncate mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      {preset.tagline}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Central Digital Tuner */}
          <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-hover)] shadow-inner">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Digital Display */}
              <div className="flex items-center gap-2">
                {/* Hours Box */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => updateHour(1)}
                    className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded transition-colors"
                    title="Add 1 hour"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <div className="w-16 h-14 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm flex items-center justify-center text-fluid-2xl font-bold font-mono tracking-wider" style={{ color: 'var(--color-primary)' }}>
                    {String(hour12).padStart(2, '0')}
                  </div>
                  <button
                    type="button"
                    onClick={() => updateHour(-1)}
                    className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded transition-colors"
                    title="Minus 1 hour"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <span className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>HOUR</span>
                </div>

                {/* Colon */}
                <div className="text-2xl font-mono font-bold mb-4 select-none" style={{ color: 'var(--color-primary)' }}>
                  :
                </div>

                {/* Minutes Box */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => updateMinute(5)}
                    className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded transition-colors"
                    title="Add 5 minutes"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <div className="w-16 h-14 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm flex items-center justify-center text-fluid-2xl font-bold font-mono tracking-wider" style={{ color: 'var(--color-primary)' }}>
                    {String(minute).padStart(2, '0')}
                  </div>
                  <button
                    type="button"
                    onClick={() => updateMinute(-5)}
                    className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded transition-colors"
                    title="Minus 5 minutes"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <span className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>MIN</span>
                </div>

                {/* AM / PM Toggle */}
                <div className="flex flex-col gap-1.5 ml-2 mb-4">
                  <button
                    type="button"
                    onClick={() => isPM && togglePeriod()}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      !isPM
                        ? 'bg-[var(--color-primary)] text-white shadow-sm'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => !isPM && togglePeriod()}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      isPM
                        ? 'bg-[var(--color-primary)] text-white shadow-sm'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>

              {/* Quick Steppers & Synchronized Native Input */}
              <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-muted)' }}>Quick Minutes:</span>
                  <div className="flex gap-1">
                    {[0, 15, 30, 45].map((mVal) => (
                      <button
                        type="button"
                        key={mVal}
                        onClick={() => handleSetMinute(mVal)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-mono transition-colors ${
                          minute === mVal
                            ? 'bg-[var(--color-primary)] text-white font-semibold'
                            : 'bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                        }`}
                      >
                        :{String(mVal).padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Format summary pill & native time sync */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="px-2.5 py-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] font-mono flex items-center gap-1.5" style={{ color: 'var(--color-text)' }}>
                    <span className="font-semibold text-[var(--color-primary)]">{format12h(dueTime)}</span>
                    <span style={{ color: 'var(--color-border)' }}>|</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>{dueTime} 24h</span>
                  </div>

                  {/* Native Time Picker trigger */}
                  <label
                    className="p-1.5 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer transition-colors relative"
                    title="Open native clock"
                  >
                    <input
                      type="time"
                      value={dueTime}
                      onChange={(e) => onDueTimeChange(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Clock size={14} />
                  </label>
                </div>

                {relativeText && (
                  <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                    <Zap size={10} className="text-[var(--color-warning)]" />
                    <span>{relativeText}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Per-Day Custom Schedule Section */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => onToggleCustomizePerDay(!customizePerDay)}
                className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] transition-colors py-1 group"
              >
                <div className="w-5 h-5 rounded-md bg-[var(--color-primary-soft)] flex items-center justify-center">
                  <Calendar size={12} className="text-[var(--color-primary)]" />
                </div>
                <span>
                  {customizePerDay ? 'Collapse per-day schedule' : 'Customize end time per day'}
                </span>
                {customizePerDay ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {customizePerDay && (
                <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                  {selectedDays.length} {selectedDays.length === 1 ? 'day' : 'days'} active
                </span>
              )}
            </div>

            {customizePerDay && (
              <div className="p-3.5 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] space-y-3 animate-fade-in">
                {/* Quick Schedule Action Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={applyToAllDays}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text)] border border-[var(--color-border)] transition-colors"
                  >
                    <Copy size={11} /> Apply {format12h(dueTime)} to all
                  </button>
                  <button
                    type="button"
                    onClick={() => applyWeekdayWeekendPreset('18:00', '22:00')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text)] border border-[var(--color-border)] transition-colors"
                  >
                    <Zap size={11} className="text-[var(--color-warning)]" /> Weekdays 6PM / Weekends 10PM
                  </button>
                  <button
                    type="button"
                    onClick={() => onDayDueTimesChange({})}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-red-500 border border-[var(--color-border)] transition-colors ml-auto"
                    title="Reset to default"
                  >
                    <RotateCcw size={11} /> Reset
                  </button>
                </div>

                {copyFeedback && (
                  <div className="text-[11px] text-[var(--color-primary)] flex items-center gap-1 animate-fade-in font-medium">
                    <Check size={12} /> {copyFeedback}
                  </div>
                )}

                {/* Day Matrix Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DAYS_META.filter((d) => selectedDays.includes(d.value)).map((d) => {
                    const currentVal = dayDueTimes[d.value] || dueTime;
                    const isCustomized = Boolean(dayDueTimes[d.value]);
                    return (
                      <div
                        key={d.value}
                        className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                          isCustomized
                            ? 'bg-[var(--color-primary-soft)] border-[var(--color-primary)]/40'
                            : 'bg-[var(--color-surface)] border-[var(--color-border)]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-[var(--color-surface-hover)] flex items-center justify-center text-xs font-bold font-mono" style={{ color: 'var(--color-text)' }}>
                            {d.label}
                          </span>
                          <div>
                            <span className="text-xs font-medium block" style={{ color: 'var(--color-text)' }}>{d.full}</span>
                            <span className="text-[10px] block font-mono" style={{ color: 'var(--color-text-muted)' }}>
                              {format12h(currentVal)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <input
                            type="time"
                            value={currentVal}
                            onChange={(e) => handleDayTimeChange(d.value, e.target.value)}
                            className="glass-input p-1.5 rounded-lg text-xs font-mono border border-[var(--color-border)] w-28 text-center"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Deadline Rule Notice */}
          <div className="p-3 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle size={14} />
            </div>
            <div className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              <span className="font-semibold" style={{ color: 'var(--color-text)' }}>Daily Lock Rule: </span>
              Habit must be logged before{' '}
              <strong className="font-mono text-[var(--color-primary)]">{format12h(dueTime)}</strong>. If not
              completed before the deadline, it will be marked as{' '}
              <strong className="text-red-500">Missed / Not Done</strong> for that day and no XP
              will be awarded.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
