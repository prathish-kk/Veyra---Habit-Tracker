/** Main dashboard with live daily habits, gamification stats, and integrated productivity analytics (Corbel theme). */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useDailyTasks, TaskItemCard } from '@/features/daily-tasks';
import {
  useGamification,
  useStreaks,
  StreakFlameBadge,
  LevelProgressBar,
  LevelUpModal,
} from '@/features/gamification';
import {
  useAnalytics,
  useHeatmap,
  WeekdayBreakdownChart,
  CategoryPieChart,
  CalendarHeatmap,
} from '@/features/analytics';
import {
  Flame,
  Zap,
  Award,
  CalendarCheck,
  ArrowRight,
  Plus,
  Sparkles,
  CheckCircle2,
  Trophy,
  BarChart3,
  PieChart as PieIcon,
  Calendar as CalendarIcon,
  Activity,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { occurrences, summary, isLoading, toggleOccurrence, deleteTask } = useDailyTasks();
  const {
    level,
    totalXp,
    currentLevelXp,
    nextLevelXp,
    progressPercentage,
  } = useGamification();
  const { dailyStreak, longestStreak } = useStreaks();

  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const {
    weekdayBreakdown,
    categoryDistribution,
    averageCompletionRate,
    totalTasksCompleted,
    totalTasksScheduled,
    bestStreak,
    topProductiveDay,
  } = useAnalytics(period);

  const { heatmap } = useHeatmap(period === '90d' ? 90 : 60);

  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const prevLevelRef = useRef<number | null>(null);

  // Trigger level-up modal if level goes up
  useEffect(() => {
    if (prevLevelRef.current !== null && level > prevLevelRef.current) {
      setIsLevelUpModalOpen(true);
    }
    prevLevelRef.current = level;
  }, [level]);

  return (
    <AppShell>
      <PageHeader
        title={`Welcome back, ${user?.name || user?.username || 'Adventurer'}! 👋`}
        subtitle="Here is your personal growth, daily habits, and productivity analytics for today."
      />

      {/* Gamification & Performance Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Daily Streak Card with Animated Flame */}
        <div className="glass p-4 rounded-2xl flex items-center justify-between border border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--color-warning)]/15 text-[var(--color-warning)]">
              <Flame size={24} />
            </div>
            <div>
              <div className="text-fluid-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Daily Streak</div>
              <div className="text-fluid-xl font-bold flex items-center gap-2 mt-0.5" style={{ color: 'var(--color-text)' }}>
                {dailyStreak} {dailyStreak === 1 ? 'Day' : 'Days'}
              </div>
            </div>
          </div>
          <StreakFlameBadge
            currentStreak={dailyStreak}
            longestStreak={longestStreak}
            size="md"
            showLabel={false}
          />
        </div>

        {/* Player Level Card - Contrast Card (Corbel accent dark style) */}
        <div className="p-4 rounded-2xl flex items-center justify-between bg-[var(--color-surface-alt)] text-[var(--color-text-on-dark)] border border-transparent shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--color-primary)] text-white">
              <Zap size={24} />
            </div>
            <div>
              <div className="text-fluid-xs opacity-70 font-medium">Player Rank</div>
              <div className="text-fluid-xl font-bold mt-0.5">
                Level {level}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsLevelUpModalOpen(true)}
            title="Preview Level Celebration"
            className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            Milestone
          </button>
        </div>

        {/* Total XP Card with Link to Achievements */}
        <div className="glass p-4 rounded-2xl flex items-center justify-between border border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
              <Award size={24} />
            </div>
            <div>
              <div className="text-fluid-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Total XP</div>
              <div className="text-fluid-xl font-bold mt-0.5" style={{ color: 'var(--color-text)' }}>
                {totalXp.toLocaleString()} XP
              </div>
            </div>
          </div>
          <Link
            to="/achievements"
            className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] text-[var(--color-text)] border border-[var(--color-border)] font-medium transition-colors flex items-center gap-1"
          >
            <Trophy size={11} /> Badges
          </Link>
        </div>

        {/* Average Completion Rate Card */}
        <div className="glass p-4 rounded-2xl flex items-center justify-between border border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="text-fluid-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Avg. Completion</div>
              <div className="text-fluid-xl font-bold mt-0.5" style={{ color: 'var(--color-text)' }}>
                {averageCompletionRate}%
              </div>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] border border-[var(--color-primary)]/20 font-semibold uppercase">
            {period}
          </span>
        </div>
      </div>

      {/* Level Progression Progress Bar */}
      <div className="mb-6">
        <LevelProgressBar
          level={level}
          currentLevelXp={currentLevelXp}
          nextLevelXp={nextLevelXp}
          progressPercentage={progressPercentage}
          totalXp={totalXp}
        />
      </div>

      {/* Main Grid: Daily Habits & Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        {/* Daily Habits Dominates (2 cols on desktop) */}
        <div className="glass p-5 md:p-6 rounded-2xl md:col-span-2 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarCheck size={20} className="text-[var(--color-primary)]" />
              <h2 className="text-fluid-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                Today's Habits & Tasks
              </h2>
            </div>
            <Link
              to="/daily"
              className="text-fluid-xs text-[var(--color-primary)] hover:underline font-medium inline-flex items-center gap-1 transition-colors"
            >
              Manage Habits <ArrowRight size={13} />
            </Link>
          </div>

          {/* Quick Progress Indicator */}
          <div className="mb-4 p-3 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] flex items-center justify-between">
            <div className="text-fluid-xs" style={{ color: 'var(--color-text-muted)' }}>
              <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{summary.completedTasks}</span> of{' '}
              <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{summary.totalTasks}</span> completed
            </div>
            <div className="text-fluid-xs font-bold text-[var(--color-primary)]">
              {summary.completionPercentage}% Done
            </div>
          </div>

          {/* Habit Items */}
          {isLoading ? (
            <div className="py-8 text-center text-fluid-sm" style={{ color: 'var(--color-text-muted)' }}>
              <div className="inline-block w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-2" />
              <p>Loading habits...</p>
            </div>
          ) : occurrences.length > 0 ? (
            <div className="space-y-3">
              {occurrences.map((occ) => (
                <TaskItemCard
                  key={occ.id}
                  occurrence={occ}
                  onToggle={toggleOccurrence}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Sparkles size={28} className="mx-auto text-[var(--color-primary)]/60 mb-2" />
              <p className="text-fluid-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>No habits scheduled for today yet.</p>
              <Link
                to="/daily"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-fluid-xs font-medium bg-[var(--color-primary)] hover:opacity-90 text-white transition-all shadow-sm"
              >
                <Plus size={14} /> Add Your First Habit
              </Link>
            </div>
          )}
        </div>

        {/* Weekly & Monthly Overview Cards */}
        <div className="space-y-4">
          <div className="glass p-5 rounded-2xl border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-fluid-base font-semibold" style={{ color: 'var(--color-text)' }}>
                Weekly Plan
              </h3>
              <Link to="/weekly" className="text-fluid-xs text-[var(--color-primary)] hover:underline">
                View
              </Link>
            </div>
            <p className="text-fluid-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
              Monday – Sunday planning cycle.
            </p>
            <div className="p-3.5 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
              <div className="text-fluid-xs font-medium text-[var(--color-primary)]">Cycle Status</div>
              <div className="text-fluid-lg font-bold mt-0.5" style={{ color: 'var(--color-text)' }}>Active Sprint</div>
              <div className="text-[11px] mt-1 flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                <CheckCircle2 size={12} className="text-[var(--color-primary)]" /> Auto-rollover scheduled for Monday
              </div>
            </div>
          </div>

          <div className="glass p-5 rounded-2xl border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-fluid-base font-semibold" style={{ color: 'var(--color-text)' }}>
                Monthly Goals
              </h3>
              <Link to="/monthly" className="text-fluid-xs text-[var(--color-primary)] hover:underline">
                View
              </Link>
            </div>
            <p className="text-fluid-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>Current month target overview.</p>
            <div className="p-3.5 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
              <div className="text-fluid-xs font-medium text-[var(--color-primary)]">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <div className="text-fluid-lg font-bold mt-0.5" style={{ color: 'var(--color-text)' }}>Strategic Plan</div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--color-text-muted)' }}>Track strategic targets for this cycle</div>
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Productivity & Habit Analytics Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
              <BarChart3 size={22} />
            </div>
            <div>
              <h2 className="text-fluid-xl font-bold" style={{ color: 'var(--color-text)' }}>
                Productivity & Performance Analytics
              </h2>
              <p className="text-fluid-xs" style={{ color: 'var(--color-text-muted)' }}>
                Discover peak performance days, category distribution, and track habit consistency.
              </p>
            </div>
          </div>

          {/* Period Selector Tabs */}
          <div className="flex items-center p-1 rounded-2xl glass border border-[var(--color-border)] self-start sm:self-auto shrink-0">
            {(['7d', '30d', '90d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-fluid-xs font-semibold transition-all',
                  period === p
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                )}
              >
                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Key Performance Indicators Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="glass p-4 rounded-2xl border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-fluid-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                Habits Logged
              </span>
              <div className="p-2 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div className="text-fluid-2xl font-black" style={{ color: 'var(--color-text)' }}>
              {totalTasksCompleted}{' '}
              <span className="text-fluid-sm font-normal" style={{ color: 'var(--color-text-muted)' }}>/ {totalTasksScheduled}</span>
            </div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-muted)' }}>Total habit check-ins in window</p>
          </div>

          <div className="glass p-4 rounded-2xl border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-fluid-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                Peak Day
              </span>
              <div className="p-2 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <CalendarIcon size={16} />
              </div>
            </div>
            <div className="text-fluid-2xl font-black" style={{ color: 'var(--color-text)' }}>{topProductiveDay}</div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-muted)' }}>Highest consistency day of week</p>
          </div>

          <div className="glass p-4 rounded-2xl border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-fluid-xs font-semibold uppercase tracking-wider text-[var(--color-warning)]">
                Record Streak
              </span>
              <div className="p-2 rounded-xl bg-[var(--color-warning)]/15 text-[var(--color-warning)]">
                <Flame size={16} />
              </div>
            </div>
            <div className="text-fluid-2xl font-black" style={{ color: 'var(--color-text)' }}>
              {bestStreak} Days 🔥
            </div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-muted)' }}>All-time personal best</p>
          </div>

          <div className="glass p-4 rounded-2xl border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-fluid-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Scheduled Volume
              </span>
              <div className="p-2 rounded-xl bg-[var(--color-surface-hover)]" style={{ color: 'var(--color-text)' }}>
                <Activity size={16} />
              </div>
            </div>
            <div className="text-fluid-2xl font-black" style={{ color: 'var(--color-text)' }}>
              {totalTasksScheduled}
            </div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-muted)' }}>Planned routine occurrences</p>
          </div>
        </div>

        {/* Charts Row: Day of Week Performance & Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="glass p-5 md:p-6 rounded-3xl border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-[var(--color-primary)]" />
                <h3 className="text-fluid-base font-bold" style={{ color: 'var(--color-text)' }}>Day of Week Performance</h3>
              </div>
              <span className="text-fluid-xs" style={{ color: 'var(--color-text-muted)' }}>Monday — Sunday</span>
            </div>
            <WeekdayBreakdownChart data={weekdayBreakdown} />
          </div>

          <div className="glass p-5 md:p-6 rounded-3xl border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieIcon size={18} className="text-[var(--color-primary)]" />
                <h3 className="text-fluid-base font-bold" style={{ color: 'var(--color-text)' }}>Category Distribution</h3>
              </div>
            </div>
            <CategoryPieChart data={categoryDistribution} />
          </div>
        </div>

        {/* Consistency Calendar Heatmap */}
        <div className="glass p-5 md:p-6 rounded-3xl border border-[var(--color-border)] mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon size={18} className="text-[var(--color-primary)]" />
              <h3 className="text-fluid-base font-bold" style={{ color: 'var(--color-text)' }}>Consistency Calendar Heatmap</h3>
            </div>
            <span className="text-fluid-xs" style={{ color: 'var(--color-text-muted)' }}>Density matrix</span>
          </div>
          <p className="text-fluid-xs mb-4 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Every square represents a day of habit tracking. Darker shades indicate higher completion rates.
          </p>
          <CalendarHeatmap data={heatmap} />
        </div>
      </div>

      {/* Level-Up Celebration Modal */}
      <LevelUpModal
        isOpen={isLevelUpModalOpen}
        onClose={() => setIsLevelUpModalOpen(false)}
        newLevel={level}
        totalXp={totalXp}
      />
    </AppShell>
  );
};
