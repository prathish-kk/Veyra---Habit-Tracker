/** Achievements gallery with unlocked badges, category filters, and XP milestones (Corbel theme). */
import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  useAchievements,
  useGamification,
  AchievementCard,
  LevelProgressBar,
  type AchievementCategory,
} from '@/features/gamification';
import { Trophy, Award, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';

const CATEGORIES: { id: AchievementCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Badges' },
  { id: 'streaks', label: 'Streaks' },
  { id: 'tasks', label: 'Habits' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'social', label: 'Social' },
];

export const AchievementsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const {
    achievements,
    unlockedCount,
    totalCount,
    completionPercentage,
    unlockedXp,
    isLoading,
  } = useAchievements(selectedCategory);

  const { level, currentLevelXp, nextLevelXp, progressPercentage } = useGamification();

  return (
    <AppShell>
      <PageHeader
        title="Achievements & Trophies"
        subtitle="Earn badges, collect bonus XP, and immortalize your consistency milestones."
      />

      {/* Top Gamification Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Unlocked Trophies Count */}
        <div className="glass p-5 rounded-2xl border border-[var(--color-border)] flex items-center justify-between">
          <div>
            <div className="text-fluid-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5" style={{ color: 'var(--color-primary)' }}>
              <Trophy size={14} />
              <span>Badges Unlocked</span>
            </div>
            <div className="text-fluid-2xl font-black" style={{ color: 'var(--color-text)' }}>
              {unlockedCount} <span className="text-fluid-base font-normal" style={{ color: 'var(--color-text-muted)' }}>/ {totalCount}</span>
            </div>
            <div className="text-fluid-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {completionPercentage}% completed
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center">
            <Award size={32} />
          </div>
        </div>

        {/* Bonus XP Earned */}
        <div className="glass p-5 rounded-2xl border border-[var(--color-border)] flex items-center justify-between">
          <div>
            <div className="text-fluid-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5" style={{ color: 'var(--color-primary)' }}>
              <Sparkles size={14} />
              <span>Achievement XP</span>
            </div>
            <div className="text-fluid-2xl font-black text-[var(--color-primary)]">
              +{unlockedXp.toLocaleString()} <span className="text-fluid-base font-normal" style={{ color: 'var(--color-text-muted)' }}>XP</span>
            </div>
            <div className="text-fluid-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Boosted your player level
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center">
            <Sparkles size={32} />
          </div>
        </div>

        {/* Player Status & Level Bar Preview */}
        <div className="glass p-5 rounded-2xl border border-[var(--color-border)] flex flex-col justify-center">
          <div className="text-fluid-xs font-semibold uppercase tracking-wider mb-2 flex items-center justify-between" style={{ color: 'var(--color-text-muted)' }}>
            <span>Current Standing</span>
            <span className="font-bold" style={{ color: 'var(--color-text)' }}>Level {level}</span>
          </div>
          <LevelProgressBar
            level={level}
            currentLevelXp={currentLevelXp}
            nextLevelXp={nextLevelXp}
            progressPercentage={progressPercentage}
            compact
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'px-4 py-2 rounded-xl text-fluid-xs font-semibold whitespace-nowrap transition-all duration-200 border',
                active
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
                  : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
              )}
              style={active ? {} : { color: 'var(--color-text-muted)' }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Achievements Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass p-5 rounded-2xl border border-[var(--color-border)] h-44 animate-pulse" />
          ))}
        </div>
      ) : achievements.length === 0 ? (
        <div className="glass p-12 rounded-3xl border border-[var(--color-border)] text-center">
          <Trophy size={48} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
          <h3 className="text-fluid-lg font-bold mb-1" style={{ color: 'var(--color-text)' }}>No achievements found</h3>
          <p className="text-fluid-xs" style={{ color: 'var(--color-text-muted)' }}>Try selecting another category or complete more habits to unlock badges.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id || achievement.key} achievement={achievement} />
          ))}
        </div>
      )}
    </AppShell>
  );
};
