/** Challenges directory page — sprint exploration, status filters, and challenge creation (Corbel theme). */
import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlassButton } from '@/components/glass/GlassButton';
import {
  useChallenges,
  ChallengeCard,
  CreateChallengeModal,
} from '@/features/challenges';
import { Trophy, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/cn';

type FilterType = 'all' | 'active' | 'my';

export const ChallengesPage: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { challenges, isLoading, createChallenge, joinChallenge } = useChallenges(filter);

  const myJoinedCount = challenges.filter((c) => c.isJoined).length;
  const totalRewardXp = challenges.reduce((sum, c) => sum + c.rewardXp, 0);

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <PageHeader
          title="Goal Sprints & Challenges"
          subtitle="Compete with friends, maintain daily streaks, and claim bonus XP together."
        />
        <GlassButton
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className="self-start sm:self-auto text-fluid-xs font-bold gap-1.5 shrink-0"
        >
          <Plus size={15} />
          <span>Create Challenge</span>
        </GlassButton>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="glass p-4 rounded-2xl border border-[var(--color-border)] flex items-center justify-between">
          <div>
            <div className="text-fluid-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              Active Challenges
            </div>
            <div className="text-fluid-2xl font-black mt-0.5" style={{ color: 'var(--color-text)' }}>
              {challenges.length}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center">
            <Trophy size={24} />
          </div>
        </div>

        <div className="glass p-4 rounded-2xl border border-[var(--color-border)] flex items-center justify-between">
          <div>
            <div className="text-fluid-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              Joined Sprints
            </div>
            <div className="text-fluid-2xl font-black mt-0.5" style={{ color: 'var(--color-text)' }}>
              {myJoinedCount}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="glass p-4 rounded-2xl border border-[var(--color-border)] flex items-center justify-between">
          <div>
            <div className="text-fluid-xs font-semibold uppercase tracking-wider text-[var(--color-warning)]">
              Reward XP Pool
            </div>
            <div className="text-fluid-2xl font-black mt-0.5" style={{ color: 'var(--color-text)' }}>
              +{totalRewardXp.toLocaleString()} XP
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[var(--color-warning)]/15 text-[var(--color-warning)] flex items-center justify-center">
            <Sparkles size={24} />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3 mb-6">
        {[
          { id: 'all', label: 'All Challenges' },
          { id: 'active', label: 'Active Sprints' },
          { id: 'my', label: 'My Challenges' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as FilterType)}
            className={cn(
              'px-4 py-2 rounded-xl text-fluid-xs font-semibold transition-all border',
              filter === tab.id
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
                : 'border-transparent hover:bg-[var(--color-surface-hover)]'
            )}
            style={filter === tab.id ? {} : { color: 'var(--color-text-muted)' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass p-5 rounded-2xl border border-[var(--color-border)] h-64 animate-pulse" />
          ))}
        </div>
      ) : challenges.length === 0 ? (
        <div className="glass p-12 rounded-3xl border border-[var(--color-border)] text-center">
          <Trophy size={48} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
          <h3 className="text-fluid-lg font-bold mb-1" style={{ color: 'var(--color-text)' }}>No challenges found</h3>
          <p className="text-fluid-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
            {filter === 'my'
              ? 'You have not joined any challenges yet. Browse active challenges to participate!'
              : 'Create a challenge to rally your friends for a habit sprint.'}
          </p>
          <GlassButton variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={14} className="mr-1.5" /> Launch First Challenge
          </GlassButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onJoin={joinChallenge}
            />
          ))}
        </div>
      )}

      <CreateChallengeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createChallenge}
      />
    </AppShell>
  );
};
