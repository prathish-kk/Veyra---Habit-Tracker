/**
 * FriendProfilePage — Dedicated full-page friend accountability profile with privacy-level masking.
 */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlassButton } from '@/components/glass/GlassButton';
import { UserAvatar } from '@/components/common/UserAvatar';
import { useFriendProgress } from '@/features/friends/hooks/useFriends';
import { Shield, CheckCircle2, Clock, Flame, Zap, Award, ArrowLeft, Lock } from 'lucide-react';
import type { PrivacyLevel } from '@/features/friends/types';

const PRIVACY_EXPLANATION: Record<
  PrivacyLevel,
  { title: string; desc: string; badge: string }
> = {
  basic: {
    title: 'Level 1: Completion Percentage Only',
    desc: 'This friend shares only their overall daily completion rate. Specific task names and counts are private.',
    badge: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-300 border-zinc-500/20',
  },
  counts: {
    title: 'Level 2: Task Counts & Rate',
    desc: 'This friend shares their completion count and overall percentage. Specific habit titles remain private.',
    badge: 'bg-primary/10 text-primary border-primary/25',
  },
  detailed: {
    title: 'Level 3: Habit Titles & Status',
    desc: 'This friend shares habit titles, emojis, and completion status. Detailed notes and timestamps remain private.',
    badge: 'bg-primary/15 text-primary border-primary/30',
  },
  full: {
    title: 'Level 4: Full Accountability Profile',
    desc: 'This friend shares complete habit details, streaks, completion timestamps, and level status.',
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
  },
};

export const FriendProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: progress, isLoading, isError } = useFriendProgress(id || null);

  const privacyMeta = progress
    ? PRIVACY_EXPLANATION[progress.privacyLevel]
    : PRIVACY_EXPLANATION.basic;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          to="/friends"
          className="inline-flex items-center gap-2 text-fluid-xs text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Friends</span>
        </Link>

        {isLoading ? (
          <div className="glass p-12 text-center rounded-2xl animate-pulse">
            <p className="text-fluid-sm text-gray-500 dark:text-zinc-400">Loading friend accountability profile...</p>
          </div>
        ) : isError || !progress ? (
          <div className="glass p-12 text-center rounded-2xl border border-rose-500/20">
            <h3 className="text-fluid-base font-bold text-gray-900 dark:text-white mb-2">Friend Profile Unavailable</h3>
            <p className="text-fluid-xs text-gray-600 dark:text-zinc-400 mb-4">
              Unable to load accountability telemetry for this user.
            </p>
            <Link to="/friends">
              <GlassButton variant="secondary" size="sm">
                Return to Friends List
              </GlassButton>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-[var(--glass-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <UserAvatar
                  src={(progress as unknown as { avatarUrl?: string })?.avatarUrl}
                  name={progress.name || progress.username}
                  size="xl"
                />
                <div>
                  <h1 className="text-fluid-xl font-bold text-gray-900 dark:text-white">{progress.name}</h1>
                  <p className="text-fluid-xs text-gray-600 dark:text-zinc-400">@{progress.username}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[var(--glass-border)] bg-black/[0.03] dark:bg-white/[0.03] text-[11px] font-semibold text-gray-700 dark:text-zinc-300">
                    <Shield size={12} className="text-primary" />
                    <span>{privacyMeta.title}</span>
                  </div>
                </div>
              </div>

              {/* Stats badges */}
              <div className="flex items-center gap-3">
                <div className="px-4 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center">
                  <div className="flex items-center justify-center gap-1 text-orange-500 dark:text-orange-400 text-xs font-bold mb-0.5">
                    <Flame size={14} />
                    <span>Streak</span>
                  </div>
                  <div className="text-fluid-lg font-extrabold text-gray-900 dark:text-white">
                    {progress.currentStreak}d
                  </div>
                </div>

                <div className="px-4 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-center">
                  <div className="flex items-center justify-center gap-1 text-primary text-xs font-bold mb-0.5">
                    <Zap size={14} />
                    <span>Level</span>
                  </div>
                  <div className="text-fluid-lg font-extrabold text-gray-900 dark:text-white">
                    {progress.level}
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Explanation Banner */}
            <div className="glass p-4 rounded-2xl border border-[var(--glass-border)] bg-black/[0.02] dark:bg-white/[0.02] flex items-center gap-3">
              <Shield size={18} className="text-primary flex-shrink-0" />
              <p className="text-fluid-xs text-gray-600 dark:text-zinc-300">{privacyMeta.desc}</p>
            </div>

            {/* Habits & Occurrences Checklist */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-[var(--glass-border)] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-fluid-base font-bold text-gray-900 dark:text-white">Daily Habit Progress</h3>
                <span className="text-fluid-xs font-bold text-primary">
                  {progress.completionPercentage}% Completed
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden p-0.5 border border-[var(--glass-border)]">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-primary"
                  style={{ width: `${progress.completionPercentage}%` }}
                />
              </div>

              {progress.privacyLevel === 'basic' && (
                <div className="p-6 text-center rounded-2xl bg-black/[0.02] dark:bg-white/5 border border-[var(--glass-border)] space-y-2">
                  <Lock size={24} className="mx-auto text-gray-400 dark:text-zinc-500" />
                  <p className="text-fluid-xs text-gray-600 dark:text-zinc-400">
                    Individual habit names and counts are masked under Level 1 privacy.
                  </p>
                </div>
              )}

              {progress.privacyLevel === 'counts' && (
                <div className="p-6 text-center rounded-2xl bg-black/[0.02] dark:bg-white/5 border border-[var(--glass-border)] space-y-2">
                  <p className="text-fluid-lg font-bold text-gray-900 dark:text-white">
                    {progress.completedTasks || 0} of {progress.totalTasks || 0} Tasks Done Today
                  </p>
                  <p className="text-fluid-xs text-gray-600 dark:text-zinc-400">
                    Specific task titles are masked under Level 2 privacy.
                  </p>
                </div>
              )}

              {(progress.privacyLevel === 'detailed' || progress.privacyLevel === 'full') && (
                <div className="space-y-2">
                  {progress.tasks?.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-black/[0.02] dark:bg-white/5 border border-[var(--glass-border)] text-fluid-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            task.completed
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : 'bg-black/10 dark:bg-zinc-700/50 text-gray-400 dark:text-zinc-500'
                          }`}
                        >
                          <CheckCircle2 size={13} />
                        </div>
                        <span className={task.completed ? 'line-through text-gray-500 dark:text-zinc-400' : 'text-gray-900 dark:text-white'}>
                          {task.title}
                        </span>
                      </div>
                      {task.completedAt && (
                        <span className="text-[10px] text-gray-400 dark:text-zinc-500">
                          {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};
