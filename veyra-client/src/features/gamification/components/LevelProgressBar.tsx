/** Level Progress Bar with animated fill and level badge (Corbel theme). */
import React from 'react';
import { Shield, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';

interface LevelProgressBarProps {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercentage: number;
  totalXp?: number;
  compact?: boolean;
  className?: string;
}

export const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  level,
  currentLevelXp,
  nextLevelXp,
  progressPercentage,
  totalXp,
  compact = false,
  className,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progressPercentage));

  if (compact) {
    return (
      <div className={cn('w-full flex items-center gap-3', className)}>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-fluid-xs shrink-0"
          style={{
            background: 'var(--color-primary-soft)',
            color: 'var(--color-primary)',
            border: '1px solid var(--color-border)',
          }}
        >
          <Shield size={12} />
          <span>Lv. {level}</span>
        </div>
        <div className="flex-1">
          <div className="w-full h-2 rounded-full overflow-hidden relative" style={{ background: 'var(--color-border)' }}>
            <div
              className="h-full rounded-full transition-all duration-700 ease-out relative"
              style={{ width: `${clampedProgress}%`, background: 'var(--color-primary)' }}
            />
          </div>
        </div>
        <span className="text-fluid-xs font-semibold shrink-0" style={{ color: 'var(--color-text-muted)' }}>
          {clampedProgress}%
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'glass p-4 md:p-5 rounded-2xl border relative overflow-hidden',
        className
      )}
      style={{ borderColor: 'var(--color-border)' }}
    >
      {/* Top Header: Level Badge and XP status */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-fluid-base shadow-sm"
              style={{
                background: 'var(--color-text)',
                color: 'var(--color-text-on-dark)',
                border: '1px solid var(--color-border)',
              }}
            >
              {level}
            </div>
            <div
              className="absolute -bottom-1 -right-1 p-0.5 rounded-full"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-primary)',
              }}
            >
              <Sparkles size={10} />
            </div>
          </div>
          <div>
            <div className="text-fluid-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--color-text)' }}>
              Level {level} Adventurer
            </div>
            <div className="text-fluid-xs" style={{ color: 'var(--color-text-muted)' }}>
              {totalXp !== undefined ? `${totalXp.toLocaleString()} Total XP` : `XP to Level ${level + 1}`}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-fluid-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
            {currentLevelXp.toLocaleString()} / {nextLevelXp.toLocaleString()} <span className="text-fluid-xs font-normal" style={{ color: 'var(--color-text-muted)' }}>XP</span>
          </div>
          <div className="text-fluid-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
            {100 - clampedProgress}% remaining
          </div>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="relative w-full h-3 rounded-full overflow-hidden p-0.5" style={{ background: 'var(--color-border)' }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out relative"
          style={{
            width: `${clampedProgress}%`,
            background: 'var(--color-primary)',
          }}
        />
      </div>
    </div>
  );
};
