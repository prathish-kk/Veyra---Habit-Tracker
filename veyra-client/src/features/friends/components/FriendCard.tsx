/** Friend card displaying friend status, streak, privacy level badge, and progress trigger (Corbel theme). */
import React, { useState } from 'react';
import { Shield, Flame, Zap, Eye, UserMinus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { UserAvatar } from '@/components/common/UserAvatar';
import type { Friendship, PrivacyLevel } from '../types';

interface FriendCardProps {
  friendship: Friendship;
  onViewProgress: (friendId: string) => void;
  onUpdatePrivacy: (friendId: string, privacyLevel: PrivacyLevel) => Promise<unknown>;
  onRemove: (friendId: string) => Promise<unknown>;
}

const PRIVACY_LABELS: Record<PrivacyLevel, { label: string; desc: string; badge: string }> = {
  basic: { label: 'L1: % Only', desc: 'Can only see your completion %', badge: 'bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] border-[var(--color-border)]' },
  counts: { label: 'L2: Counts', desc: 'Can see task counts + %', badge: 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] border-[var(--color-primary)]/30' },
  detailed: { label: 'L3: Detailed', desc: 'Can see task titles and status', badge: 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] border-[var(--color-primary)]/30' },
  full: { label: 'L4: Full', desc: 'Can see full habits, streak, and notes', badge: 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] border-[var(--color-primary)]/40 font-bold' },
};

export const FriendCard: React.FC<FriendCardProps> = ({
  friendship,
  onViewProgress,
  onUpdatePrivacy,
  onRemove,
}) => {
  const { friend, privacyLevel } = friendship;
  const [showPrivacyMenu, setShowPrivacyMenu] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePrivacyChange = async (newLevel: PrivacyLevel) => {
    setIsUpdating(true);
    try {
      await onUpdatePrivacy(friend.id, newLevel);
      setShowPrivacyMenu(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (window.confirm(`Are you sure you want to remove ${friend.name || friend.username} from your friends?`)) {
      await onRemove(friend.id);
    }
  };

  return (
    <div className="glass p-5 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-text-muted)] transition-all flex flex-col justify-between select-none relative group bg-[var(--color-surface)]">
      <div>
        {/* Top Header: Avatar + User Info + Options */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <UserAvatar
              src={friend.avatarUrl}
              name={friend.name || friend.username}
              size="lg"
            />
            <div>
              <h3 className="text-fluid-base font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
                {friend.name || friend.username}
              </h3>
              <p className="text-fluid-xs" style={{ color: 'var(--color-text-muted)' }}>@{friend.username || 'user'}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Privacy Badge / Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowPrivacyMenu(!showPrivacyMenu)}
                className={cn(
                  'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors flex items-center gap-1',
                  PRIVACY_LABELS[privacyLevel].badge
                )}
                title={`Your privacy toward this friend: ${PRIVACY_LABELS[privacyLevel].label}`}
              >
                <Shield size={10} />
                <span>{PRIVACY_LABELS[privacyLevel].label}</span>
              </button>

              {/* Privacy Menu Dropdown */}
              {showPrivacyMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 glass-heavy p-2 rounded-xl border border-[var(--color-border)] shadow-xl z-30 bg-[var(--color-surface)]">
                  <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-1" style={{ color: 'var(--color-text-muted)' }}>
                    Your Privacy Setting
                  </div>
                  {(['basic', 'counts', 'detailed', 'full'] as PrivacyLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => handlePrivacyChange(lvl)}
                      disabled={isUpdating}
                      className={cn(
                        'w-full text-left px-2 py-1.5 rounded-lg text-fluid-xs transition-colors flex flex-col',
                        privacyLevel === lvl ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold' : 'hover:bg-[var(--color-surface-hover)]'
                      )}
                      style={privacyLevel === lvl ? {} : { color: 'var(--color-text)' }}
                    >
                      <span>{PRIVACY_LABELS[lvl].label}</span>
                      <span className="text-[10px] font-normal" style={{ color: 'var(--color-text-muted)' }}>{PRIVACY_LABELS[lvl].desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Remove Friend Button */}
            <button
              onClick={handleRemove}
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Remove friend"
            >
              <UserMinus size={15} />
            </button>
          </div>
        </div>

        {/* Stats Row: Streak, Level, Total XP */}
        <div className="grid grid-cols-3 gap-2 my-4 p-2.5 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-center">
          <div>
            <div className="text-[10px] uppercase font-semibold text-[var(--color-warning)] flex items-center justify-center gap-1">
              <Flame size={11} /> Streak
            </div>
            <div className="text-fluid-sm font-bold mt-0.5" style={{ color: 'var(--color-text)' }}>{friend.currentStreak}d</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-[var(--color-primary)] flex items-center justify-center gap-1">
              <Zap size={11} /> Level
            </div>
            <div className="text-fluid-sm font-bold mt-0.5" style={{ color: 'var(--color-text)' }}>Lv. {friend.level}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-[var(--color-primary)] flex items-center justify-center gap-1">
              XP
            </div>
            <div className="text-fluid-sm font-bold mt-0.5" style={{ color: 'var(--color-text)' }}>{friend.totalXp.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Action: View Progress */}
      <button
        onClick={() => onViewProgress(friend.id)}
        className="w-full mt-2 py-2 px-3 rounded-xl bg-[var(--color-surface-hover)] hover:bg-[var(--color-primary-soft)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 text-fluid-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
      >
        <Eye size={13} />
        <span>View Accountability Progress</span>
      </button>
    </div>
  );
};
