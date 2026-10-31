/** Streak flame badge showing daily streak momentum (Corbel theme). */
import React from 'react';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/cn';

interface StreakFlameBadgeProps {
  currentStreak: number;
  longestStreak?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const StreakFlameBadge: React.FC<StreakFlameBadgeProps> = ({
  currentStreak,
  longestStreak = 0,
  size = 'md',
  showLabel = true,
  className,
}) => {
  const isLegendary = currentStreak >= 14;
  const isSuper = currentStreak >= 7;
  const isActive = currentStreak > 0;

  const sizeClasses = {
    sm: 'px-2 py-1 text-fluid-xs gap-1.5',
    md: 'px-3 py-1.5 text-fluid-sm gap-2',
    lg: 'px-4 py-2.5 text-fluid-base gap-2.5',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center rounded-full font-semibold transition-all duration-300 border select-none group',
        sizeClasses[size],
        className
      )}
      style={{
        background: isActive
          ? isLegendary
            ? 'color-mix(in srgb, var(--color-warning) 15%, transparent)'
            : 'var(--color-primary-soft)'
          : 'var(--color-surface-hover)',
        borderColor: isActive
          ? isLegendary
            ? 'color-mix(in srgb, var(--color-warning) 35%, transparent)'
            : 'var(--color-border-strong)'
          : 'var(--color-border)',
        color: isActive
          ? isLegendary
            ? 'var(--color-warning)'
            : 'var(--color-primary)'
          : 'var(--color-text-muted)',
      }}
      title={
        longestStreak > 0
          ? `Current streak: ${currentStreak} days | Personal best: ${longestStreak} days`
          : `Current streak: ${currentStreak} days`
      }
    >
      {/* Flame Icon */}
      <span
        className={cn(
          'transition-transform duration-300 group-hover:scale-110 flex items-center justify-center',
          isActive && isLegendary && 'animate-pulse'
        )}
      >
        <Flame
          size={iconSizes[size]}
          className={isActive ? 'fill-current' : 'fill-none'}
        />
      </span>

      {/* Streak Number & Label */}
      <span className="font-bold tracking-tight">
        {currentStreak}
        {showLabel && (
          <span className="ml-1 font-normal opacity-90">
            {currentStreak === 1 ? 'day' : 'days'}
          </span>
        )}
      </span>

      {/* Longest streak pill on large mode */}
      {size === 'lg' && longestStreak > 0 && (
        <span
          className="text-fluid-xs px-2 py-0.5 rounded-full font-normal ml-1"
          style={{ background: 'var(--color-surface-hover)', color: 'var(--color-text-muted)' }}
        >
          Best: {longestStreak}d
        </span>
      )}
    </div>
  );
};
