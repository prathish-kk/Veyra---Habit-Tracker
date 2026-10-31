/** Challenge card component displaying sprint details, progress bar, and join action (Corbel theme). */
import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Flame, CheckCircle2, Users, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Challenge } from '../types';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin?: (id: string) => Promise<unknown>;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onJoin }) => {
  const {
    id,
    title,
    description,
    type,
    targetValue,
    rewardXp,
    startDate,
    endDate,
    participantCount,
    isJoined,
    userProgress = 0,
    isCompleted,
  } = challenge;

  const progressPercentage = Math.min(100, Math.round((userProgress / targetValue) * 100));

  const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    daily_streak: {
      label: 'Daily Streak',
      icon: <Flame size={12} className="text-[var(--color-warning)]" />,
      color: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/30',
    },
    task_count: {
      label: 'Habit Count',
      icon: <CheckCircle2 size={12} className="text-[var(--color-primary)]" />,
      color: 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] border-[var(--color-primary)]/30',
    },
    custom: {
      label: 'Custom Sprint',
      icon: <Trophy size={12} className="text-[var(--color-primary)]" />,
      color: 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] border-[var(--color-primary)]/30',
    },
  };

  const currentType = typeConfig[type] || typeConfig.custom;

  return (
    <div className="glass p-5 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-text-muted)] transition-all flex flex-col justify-between select-none relative group bg-[var(--color-surface)]">
      <div>
        {/* Top Badges: Type + Reward XP */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={cn(
              'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5',
              currentType.color
            )}
          >
            {currentType.icon}
            <span>{currentType.label}</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--color-warning)]/15 border border-[var(--color-warning)]/30 text-[var(--color-warning)] text-fluid-xs font-bold shadow-sm">
            <Sparkles size={11} />
            +{rewardXp} XP
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-fluid-base font-bold transition-colors mb-1" style={{ color: 'var(--color-text)' }}>
          {title}
        </h3>
        {description && (
          <p className="text-fluid-xs leading-relaxed line-clamp-2 mb-4" style={{ color: 'var(--color-text-muted)' }}>
            {description}
          </p>
        )}

        {/* Metadata: Dates & Participants */}
        <div className="flex items-center justify-between text-[11px] mb-4 pb-3 border-b border-[var(--color-border)]" style={{ color: 'var(--color-text-muted)' }}>
          <span className="flex items-center gap-1.5">
            <Calendar size={12} />
            {startDate} to {endDate}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={12} />
            {participantCount} {participantCount === 1 ? 'challenger' : 'challengers'}
          </span>
        </div>

        {/* If user has joined, show active progress bar */}
        {isJoined && (
          <div className="mb-4 p-3 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between text-fluid-xs mb-1.5">
              <span className="font-semibold" style={{ color: 'var(--color-text)' }}>Your Progress</span>
              <span className="font-bold text-[var(--color-primary)]">
                {userProgress} / {targetValue}{' '}
                <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>({progressPercentage}%)</span>
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 bg-[var(--color-primary)]"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            {isCompleted && (
              <div className="text-[11px] text-[var(--color-primary)] font-semibold mt-1.5 flex items-center gap-1">
                <CheckCircle2 size={12} /> Target Completed!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-2">
        <Link
          to={`/challenges/${id}`}
          className="flex-1 py-2 px-3 rounded-xl bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] text-fluid-xs font-semibold transition-all flex items-center justify-center gap-1 border border-[var(--color-border)]"
          style={{ color: 'var(--color-text)' }}
        >
          <span>View Leaderboard</span>
          <ArrowRight size={13} />
        </Link>

        {!isJoined && onJoin && (
          <button
            onClick={() => onJoin(id)}
            className="py-2 px-4 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-white font-bold text-fluid-xs transition-all shadow-sm flex items-center gap-1.5"
          >
            <Trophy size={13} />
            <span>Join</span>
          </button>
        )}
      </div>
    </div>
  );
};
