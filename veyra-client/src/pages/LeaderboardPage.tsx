/** Leaderboard rankings page — Global platform rankings by XP, Level, and Streaks (Corbel theme). */
import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { UserAvatar } from '@/components/common/UserAvatar';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useLeaderboard, type LeaderboardSortMetric } from '@/features/leaderboard';
import { useGamification, useStreaks } from '@/features/gamification';
import {
  Award,
  Flame,
  Medal,
  Users,
  Sparkles,
  Crown,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const { level, totalXp } = useGamification();
  const { dailyStreak } = useStreaks();

  const [activeTab, setActiveTab] = useState<LeaderboardSortMetric>('xp');
  const { entries: leaderboardEntries, isLoading } = useLeaderboard(activeTab);

  const currentUserId = user?.id;
  const currentFirebaseUid = user?.firebaseUid;
  const currentUsername = user?.username?.toLowerCase()?.trim();

  const isCurrentMe = (e: { id: string; username?: string | null }) => {
    if (!user) return false;
    if (currentUserId && e.id === currentUserId) return true;
    if (currentFirebaseUid && e.id === currentFirebaseUid) return true;
    if (currentUsername && e.username && e.username.toLowerCase().trim() === currentUsername) return true;
    return false;
  };

  // Filter dummy accounts and deduplicate by ID, username, and identity
  const seenIds = new Set<string>();
  const seenUsernames = new Set<string>();
  const sanitizedEntries: typeof leaderboardEntries = [];

  const BANNED_IDS = ['usr_demo', 'demo', 'mock', 'usr_sarahkim', 'usr_jordanlee', 'usr_alexrivera', 'usr_samtaylor', 'usr_mayachen'];
  const BANNED_USERNAMES = ['demo', 'friend', 'sarah_k', 'sarahkim', 'jordan_lee', 'jordanlee', 'alex_r', 'alexrivera', 'sam_t', 'samtaylor', 'mayachen'];
  const BANNED_NAMES = ['demo user', 'friend', 'sarah kim', 'jordan lee', 'alex rivera', 'sam taylor', 'maya chen'];

  for (const entry of leaderboardEntries) {
    const eid = entry.id?.toLowerCase().trim();
    const euser = entry.username?.toLowerCase().trim();
    const ename = entry.name?.toLowerCase().trim();

    if (
      (eid && BANNED_IDS.includes(eid)) ||
      (euser && BANNED_USERNAMES.includes(euser)) ||
      (ename && BANNED_NAMES.includes(ename))
    ) {
      continue;
    }

    const normUser = entry.username?.toLowerCase().trim();
    if (seenIds.has(entry.id)) continue;
    if (normUser && seenUsernames.has(normUser)) continue;

    if (isCurrentMe(entry)) {
      if (seenIds.has('CURRENT_USER_SEEN')) continue;
      seenIds.add('CURRENT_USER_SEEN');
    }

    seenIds.add(entry.id);
    if (normUser) seenUsernames.add(normUser);
    sanitizedEntries.push(entry);
  }

  const userFoundInLeaderboard = seenIds.has('CURRENT_USER_SEEN') || sanitizedEntries.some(isCurrentMe);

  const combinedEntries = sanitizedEntries.map((e) => {
    const isMe = isCurrentMe(e);
    return {
      id: e.id,
      name: isMe ? (user?.name || user?.username || e.name) : e.name || e.username || 'Adventurer',
      username: e.username,
      avatarUrl: isMe ? (user?.avatarUrl || e.avatarUrl) : e.avatarUrl,
      level: isMe ? Math.max(e.level, level || 1) : e.level,
      xp: isMe ? Math.max(e.totalXp, totalXp || 0) : e.totalXp,
      streak: isMe ? Math.max(e.currentStreak, dailyStreak || 0) : e.currentStreak,
      isMe: Boolean(isMe),
    };
  });

  // If authenticated user is not yet indexed in leaderboard, include them once
  if (!userFoundInLeaderboard && user) {
    combinedEntries.push({
      id: user.id || user.firebaseUid || 'me',
      name: user.name || user.username || 'You',
      username: user.username || 'you',
      avatarUrl: user.avatarUrl || null,
      level: level || 1,
      xp: totalXp || 0,
      streak: dailyStreak || 0,
      isMe: true,
    });
  }

  // Sort based on active tab
  const sortedEntries = [...combinedEntries].sort((a, b) => {
    if (activeTab === 'xp') {
      if (b.xp !== a.xp) return b.xp - a.xp;
      return b.streak - a.streak;
    }
    if (b.streak !== a.streak) return b.streak - a.streak;
    return b.xp - a.xp;
  });

  const topThree = sortedEntries.slice(0, 3);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-xl bg-[var(--color-warning)]/20 text-[var(--color-warning)] border border-[var(--color-warning)]/40 flex items-center justify-center font-bold">
            <Crown size={16} />
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-xl bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] border border-[var(--color-border)] flex items-center justify-center font-bold">
            <Medal size={16} />
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-xl bg-[var(--color-warning)]/10 text-[var(--color-warning)] border border-[var(--color-warning)]/20 flex items-center justify-center font-bold">
            <Medal size={16} />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-fluid-xs font-bold" style={{ color: 'var(--color-text-muted)' }}>
            #{rank}
          </div>
        );
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Rankings & Leaderboard"
        subtitle="Global platform rankings by Experience (XP), Level, and Habit Streaks across all Veyra adventurers."
      />

      {/* Metric Selector Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-[var(--color-border)] pb-3">
        <button
          onClick={() => setActiveTab('xp')}
          className={cn(
            'px-4 py-2 rounded-xl text-fluid-xs font-bold transition-all flex items-center gap-2 border',
            activeTab === 'xp'
              ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
              : 'border-transparent hover:bg-[var(--color-surface-hover)]'
          )}
          style={activeTab === 'xp' ? {} : { color: 'var(--color-text-muted)' }}
        >
          <Award size={15} /> Top by Experience (XP)
        </button>
        <button
          onClick={() => setActiveTab('streak')}
          className={cn(
            'px-4 py-2 rounded-xl text-fluid-xs font-bold transition-all flex items-center gap-2 border',
            activeTab === 'streak'
              ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
              : 'border-transparent hover:bg-[var(--color-surface-hover)]'
          )}
          style={activeTab === 'streak' ? {} : { color: 'var(--color-text-muted)' }}
        >
          <Flame size={15} /> Longest Active Streaks
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass p-6 rounded-3xl border border-[var(--color-border)] h-56 animate-pulse" />
            ))}
          </div>
          <div className="glass p-6 rounded-3xl border border-[var(--color-border)] h-64 animate-pulse" />
        </div>
      ) : sortedEntries.length === 0 ? (
        <div className="glass p-12 rounded-3xl border border-[var(--color-border)] text-center mb-8">
          <Globe size={40} className="mx-auto mb-2" style={{ color: 'var(--color-text-muted)' }} />
          <h4 className="text-fluid-base font-bold" style={{ color: 'var(--color-text)' }}>No active rankings yet</h4>
          <p className="text-fluid-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Complete daily habits to earn XP and be the first on the global leaderboard!
          </p>
        </div>
      ) : (
        <>
          {/* Podium Top 3 */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {topThree.map((item, index) => {
                const rank = index + 1;
                const isFirst = rank === 1;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      'glass p-5 rounded-3xl border transition-all text-center relative overflow-hidden',
                      item.isMe ? 'ring-2 ring-[var(--color-primary)]' : '',
                      isFirst
                        ? 'border-[var(--color-primary)]/40 bg-[var(--color-primary-soft)]/20 md:-translate-y-2'
                        : 'border-[var(--color-border)]'
                    )}
                  >
                    {isFirst && (
                      <div className="absolute top-3 right-3 text-[var(--color-warning)] animate-pulse">
                        <Sparkles size={18} />
                      </div>
                    )}

                    <div className="flex justify-center mb-3">{getRankBadge(rank)}</div>

                    <UserAvatar
                      src={item.avatarUrl}
                      name={item.name}
                      size="xl"
                      className="mx-auto mb-3"
                    />

                    <h3 className="text-fluid-base font-bold truncate" style={{ color: 'var(--color-text)' }}>
                      {item.name} {item.isMe && <span className="text-[var(--color-primary)]">(You)</span>}
                    </h3>
                    <p className="text-[11px] mb-3" style={{ color: 'var(--color-text-muted)' }}>@{item.username}</p>

                    <div className="p-3 rounded-2xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] flex items-center justify-around">
                      <div>
                        <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--color-text-muted)' }}>Level</div>
                        <div className="text-fluid-sm font-black text-[var(--color-primary)]">{item.level}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--color-text-muted)' }}>
                          {activeTab === 'xp' ? 'Total XP' : 'Streak'}
                        </div>
                        <div className="text-fluid-sm font-black text-[var(--color-warning)]">
                          {activeTab === 'xp' ? `${item.xp.toLocaleString()} XP` : `${item.streak} days`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full Standings Table */}
          <div className="glass rounded-3xl border border-[var(--color-border)] overflow-hidden mb-6">
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <h2 className="text-fluid-base font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                <Users size={16} className="text-[var(--color-primary)]" />
                Global Standings
              </h2>
              <span className="text-fluid-xs" style={{ color: 'var(--color-text-muted)' }}>{sortedEntries.length} Adventurers</span>
            </div>

            <div className="divide-y divide-[var(--color-border)]">
              {sortedEntries.map((item, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      'p-4 flex items-center justify-between gap-4 transition-colors',
                      item.isMe ? 'bg-[var(--color-primary-soft)]/30' : 'hover:bg-[var(--color-surface-hover)]'
                    )}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-8 text-center text-fluid-sm font-bold" style={{ color: 'var(--color-text-muted)' }}>
                        {rank <= 3 ? getRankBadge(rank) : `#${rank}`}
                      </div>

                      <UserAvatar
                        src={item.avatarUrl}
                        name={item.name}
                        size="md"
                      />

                      <div className="min-w-0">
                        <div className="text-fluid-sm font-bold truncate flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                          <span>{item.name}</span>
                          {item.isMe && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] border border-[var(--color-primary)]/30 font-semibold">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>@{item.username}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0 text-right">
                      <div>
                        <div className="text-[10px] uppercase font-semibold" style={{ color: 'var(--color-text-muted)' }}>Level</div>
                        <div className="text-fluid-xs font-bold" style={{ color: 'var(--color-text)' }}>{item.level}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-semibold" style={{ color: 'var(--color-text-muted)' }}>Streak</div>
                        <div className="text-fluid-xs font-bold text-[var(--color-warning)] flex items-center justify-end gap-1">
                          <Flame size={12} /> {item.streak}d
                        </div>
                      </div>
                      <div className="min-w-[70px]">
                        <div className="text-[10px] uppercase font-semibold" style={{ color: 'var(--color-text-muted)' }}>XP</div>
                        <div className="text-fluid-xs font-bold text-[var(--color-primary)]">
                          {item.xp.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
};
