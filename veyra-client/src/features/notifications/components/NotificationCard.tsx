/** NotificationCard — item in notifications list or drawer (Corbel theme). */
import React from 'react';
import {
  Flame,
  Trophy,
  Users,
  Target,
  Clock,
  Sparkles,
  Check,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import type { NotificationItem, NotificationType } from '../types';

interface NotificationCardProps {
  notification: NotificationItem;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const { id, type, title, body, read, createdAt } = notification;

  const getTypeIcon = (t: NotificationType) => {
    switch (t) {
      case 'streak':
        return <Flame size={18} className="text-[var(--color-warning)]" />;
      case 'achievement':
        return <Trophy size={18} className="text-[var(--color-warning)]" />;
      case 'friend_request':
        return <Users size={18} className="text-[var(--color-primary)]" />;
      case 'challenge_invite':
        return <Target size={18} className="text-[var(--color-primary)]" />;
      case 'deadline_urgent':
        return <Clock size={18} className="text-red-500" />;
      default:
        return <Sparkles size={18} className="text-[var(--color-primary)]" />;
    }
  };

  const getRelativeTime = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div
      className={cn(
        'p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 group',
        read
          ? 'bg-[var(--color-surface)] border-[var(--color-border)] opacity-80 hover:opacity-100 hover:bg-[var(--color-surface-hover)]'
          : 'bg-[var(--color-primary-soft)]/40 border-[var(--color-primary)]/40 shadow-sm'
      )}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div
          className={cn(
            'p-2.5 rounded-xl border shrink-0',
            read ? 'bg-[var(--color-surface-hover)] border-[var(--color-border)]' : 'bg-[var(--color-surface)] border-[var(--color-primary)]/30'
          )}
        >
          {getTypeIcon(type)}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-fluid-xs font-bold truncate" style={{ color: 'var(--color-text)' }}>{title}</h4>
            {!read && (
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] shrink-0" />
            )}
          </div>
          <p className="text-[12px] leading-snug mb-1.5" style={{ color: 'var(--color-text-muted)' }}>{body}</p>
          <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-muted)' }}>{getRelativeTime(createdAt)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
        {!read && onMarkAsRead && (
          <button
            onClick={() => onMarkAsRead(id)}
            title="Mark as read"
            aria-label="Mark as read"
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            <Check size={14} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            title="Delete notification"
            aria-label="Delete notification"
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
