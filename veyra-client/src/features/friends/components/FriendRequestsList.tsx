/** List of pending incoming friend requests with Accept & Decline buttons. */
import React, { useState } from 'react';
import { GlassButton } from '@/components/glass/GlassButton';
import { UserAvatar } from '@/components/common/UserAvatar';
import { Check, X, UserCheck, Flame, Zap } from 'lucide-react';
import type { FriendRequest } from '../types';

interface FriendRequestsListProps {
  requests: FriendRequest[];
  onRespond: (requestId: string, action: 'accept' | 'reject') => Promise<unknown>;
}

export const FriendRequestsList: React.FC<FriendRequestsListProps> = ({ requests, onRespond }) => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  if (requests.length === 0) {
    return (
      <div className="glass p-8 rounded-2xl border border-[var(--glass-border)] text-center text-gray-500 dark:text-zinc-400 text-fluid-sm">
        <UserCheck size={36} className="mx-auto text-gray-400 dark:text-zinc-500 mb-2" />
        <p className="font-semibold text-gray-900 dark:text-white">No pending friend requests</p>
        <p className="text-fluid-xs text-gray-600 dark:text-zinc-400 mt-1">When someone sends you a friend request, it will show up here.</p>
      </div>
    );
  }

  const handleAction = async (requestId: string, action: 'accept' | 'reject') => {
    setProcessingId(requestId);
    try {
      await onRespond(requestId, action);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <div
          key={req.id}
          className="glass p-4 rounded-2xl border border-[var(--glass-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
        >
          <div className="flex items-center gap-3">
            <UserAvatar
              src={req.sender.avatarUrl}
              name={req.sender.name || req.sender.username}
              size="md"
            />
            <div>
              <div className="font-bold text-gray-900 dark:text-white text-fluid-sm">{req.sender.name || req.sender.username}</div>
              <div className="text-fluid-xs text-gray-600 dark:text-zinc-400">@{req.sender.username || 'user'}</div>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 dark:text-zinc-300">
                <span className="flex items-center gap-0.5 text-primary font-medium">
                  <Zap size={11} /> Lv. {req.sender.level}
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-orange-500 dark:text-orange-400 font-medium">
                  <Flame size={11} /> {req.sender.currentStreak}d streak
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <GlassButton
              variant="ghost"
              onClick={() => handleAction(req.id, 'reject')}
              disabled={processingId === req.id}
              className="text-fluid-xs px-3 py-1.5"
            >
              <X size={13} className="mr-1" /> Decline
            </GlassButton>
            <GlassButton
              variant="primary"
              onClick={() => handleAction(req.id, 'accept')}
              disabled={processingId === req.id}
              className="text-fluid-xs px-3 py-1.5"
            >
              <Check size={13} className="mr-1" /> Accept
            </GlassButton>
          </div>
        </div>
      ))}
    </div>
  );
};
