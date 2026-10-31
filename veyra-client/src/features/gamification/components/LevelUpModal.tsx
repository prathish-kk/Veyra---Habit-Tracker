/** Level-up celebration modal with animated perks (Corbel theme). */
import React, { useEffect } from 'react';
import { GlassButton } from '@/components/glass/GlassButton';
import { Sparkles, Trophy, Star, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { playLevelUpFanfare } from '@/lib/sound';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  totalXp?: number;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  newLevel,
  totalXp,
}) => {
  useEffect(() => {
    if (isOpen) {
      playLevelUpFanfare();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className="glass-heavy relative z-10 w-full max-w-md p-6 md:p-8 rounded-3xl border text-center animate-in fade-in zoom-in-95 duration-300 overflow-hidden"
        style={{
          borderColor: 'var(--color-border-strong)',
          boxShadow: 'var(--surface-shadow-elevated)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Sparks */}
        <div className="flex justify-center mb-2">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-fluid-xs font-bold uppercase tracking-wider shadow-sm"
            style={{
              background: 'var(--color-primary-soft)',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <Sparkles size={14} className="animate-spin" />
            <span>Milestone Reached!</span>
          </div>
        </div>

        {/* Level Emblem */}
        <div className="relative my-4 inline-block">
          <div
            className="w-24 h-24 mx-auto rounded-3xl p-1 animate-bounce"
            style={{
              background: 'var(--color-text)',
              boxShadow: 'var(--surface-shadow-elevated)',
            }}
          >
            <div
              className="w-full h-full rounded-[22px] flex flex-col items-center justify-center"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>Level</span>
              <span className="text-4xl font-extrabold" style={{ color: 'var(--color-text)' }}>
                {newLevel}
              </span>
            </div>
          </div>
          <div
            className="absolute -bottom-2 -right-2 p-1.5 rounded-full shadow-lg"
            style={{ background: 'var(--color-primary)', color: 'var(--color-text-on-primary)' }}
          >
            <Trophy size={16} />
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-fluid-2xl font-black tracking-tight mb-2" style={{ color: 'var(--color-text)' }}>
          LEVEL UP!
        </h2>
        <p className="text-fluid-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Outstanding work! Your discipline and consistency have unlocked Level {newLevel}.
          Keep crushing your goals!
        </p>

        {/* Perks / Rewards Unlocked */}
        <div
          className="rounded-2xl p-4 text-left mb-6 space-y-2.5"
          style={{
            background: 'var(--color-surface-hover)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div className="text-fluid-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--color-primary)' }}>
            <Star size={13} />
            <span>Rewards & Perks Unlocked</span>
          </div>
          <div className="flex items-center justify-between text-fluid-xs" style={{ color: 'var(--color-text-secondary)' }}>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-primary)' }} />
              Next tier leaderboard eligibility
            </span>
            <span className="font-bold" style={{ color: 'var(--color-success)' }}>Active</span>
          </div>
          <div className="flex items-center justify-between text-fluid-xs" style={{ color: 'var(--color-text-secondary)' }}>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-primary)' }} />
              Level {newLevel} profile badge
            </span>
            <span className="font-bold" style={{ color: 'var(--color-success)' }}>Equipped</span>
          </div>
          {totalXp !== undefined && (
            <div className="flex items-center justify-between text-fluid-xs" style={{ color: 'var(--color-text-secondary)' }}>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-primary)' }} />
                Total XP Accumulated
              </span>
              <span className="font-bold" style={{ color: 'var(--color-primary)' }}>{totalXp.toLocaleString()} XP</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <GlassButton
          variant="primary"
          onClick={onClose}
          className="w-full justify-center text-fluid-sm py-3 font-bold"
        >
          Claim & Continue
        </GlassButton>
      </div>
    </div>
  );
};
