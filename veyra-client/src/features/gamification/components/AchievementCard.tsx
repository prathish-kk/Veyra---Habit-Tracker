/** Interactive card displaying an achievement with unlocked/locked states (Corbel theme). */
import React from 'react';
import { Lock, CheckCircle2, Award, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Achievement } from '../types';

interface AchievementCardProps {
  achievement: Achievement;
  onClick?: () => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, onClick }) => {
  const { title, description, icon, xpReward, category, unlocked, unlockedAt } = achievement;

  const formattedDate = unlockedAt
    ? new Date(unlockedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : null;

  const categoryLabels: Record<string, string> = {
    streaks: 'Streaks',
    tasks: 'Habits',
    milestones: 'Milestone',
    social: 'Social',
  };

  return (
    <div
      onClick={onClick}
      className="group relative p-4 md:p-5 rounded-2xl transition-all duration-300 border flex flex-col justify-between select-none glass hover:-translate-y-0.5"
      style={{
        borderColor: unlocked ? 'var(--color-border-strong)' : 'var(--color-border)',
        opacity: unlocked ? 1 : 0.65,
        background: unlocked
          ? 'color-mix(in srgb, var(--color-primary-soft) 50%, var(--color-surface))'
          : 'var(--color-surface)',
      }}
    >
      {/* Top Header: Icon + Category + Status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="relative">
          <div
            className={cn(
              'w-13 h-13 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110',
              !unlocked && 'grayscale'
            )}
            style={{
              background: unlocked ? 'var(--color-primary-soft)' : 'var(--color-surface-hover)',
              border: `1px solid ${unlocked ? 'var(--color-border-strong)' : 'var(--color-border)'}`,
            }}
          >
            {icon}
          </div>
          {unlocked && (
            <div
              className="absolute -bottom-1 -right-1 p-0.5 rounded-full shadow"
              style={{
                background: 'var(--color-success)',
                color: 'var(--color-text-on-primary)',
                border: '2px solid var(--color-surface)',
              }}
            >
              <CheckCircle2 size={12} strokeWidth={3} />
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
              background: 'var(--color-surface-hover)',
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
            }}
          >
            {categoryLabels[category] || category}
          </span>
          <span
            className="inline-flex items-center gap-1 text-fluid-xs font-semibold px-2 py-0.5 rounded-full border"
            style={{
              background: unlocked ? 'var(--color-primary-soft)' : 'var(--color-surface-hover)',
              color: unlocked ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderColor: 'var(--color-border)',
            }}
          >
            <Sparkles size={11} />
            +{xpReward} XP
          </span>
        </div>
      </div>

      {/* Body: Title & Description */}
      <div>
        <h3
          className="text-fluid-sm font-bold tracking-tight mb-1 transition-colors"
          style={{ color: 'var(--color-text)' }}
        >
          {title}
        </h3>
        <p className="text-fluid-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
          {description}
        </p>
      </div>

      {/* Footer: Date or Locked Status */}
      <div className="pt-2 border-t flex items-center justify-between text-[11px]" style={{ borderColor: 'var(--color-border)' }}>
        {unlocked ? (
          <span className="font-medium flex items-center gap-1" style={{ color: 'var(--color-success)' }}>
            <Award size={12} />
            {formattedDate ? `Unlocked ${formattedDate}` : 'Unlocked'}
          </span>
        ) : (
          <span className="font-medium flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
            <Lock size={12} />
            Locked
          </span>
        )}
      </div>
    </div>
  );
};
