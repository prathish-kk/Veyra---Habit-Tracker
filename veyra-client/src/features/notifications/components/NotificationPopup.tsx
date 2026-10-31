/**
 * NotificationPopup — Floating alert toast that pops up when a scheduled
 * or real-time notification arrives (Corbel theme).
 */
import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Zap, Bell, X, Check, Volume2, Clock } from 'lucide-react';
import { useNotificationPopupStore } from '../store/notificationPopupStore';
import { useNotifications, requestNotificationPermission } from '../hooks/useNotifications';

export const NotificationPopup: React.FC = () => {
  const { currentPopup, dismissPopup } = useNotificationPopupStore();
  const { markAsRead } = useNotifications();
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const canRequestPush =
    typeof window !== 'undefined' &&
    'Notification' in window &&
    Notification.permission === 'default' &&
    !hasRequestedPermission;

  // Auto-dismiss countdown
  useEffect(() => {
    if (!currentPopup) {
      setProgress(100);
      return;
    }

    setProgress(100);
    const duration = 8000; // 8 seconds
    const intervalTime = 100;
    const step = (intervalTime / duration) * 100;

    timerRef.current = setInterval(() => {
      if (isPaused) return;
      setProgress((prev) => {
        if (prev <= 0) {
          dismissPopup();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentPopup, isPaused, dismissPopup]);

  if (!currentPopup) return null;

  const handleMarkRead = () => {
    if (currentPopup.id && !currentPopup.id.startsWith('temp_')) {
      try {
        markAsRead(currentPopup.id).catch(() => {});
      } catch {
        // ignore
      }
    }
    dismissPopup();
  };

  const handleEnablePush = async () => {
    const res = await requestNotificationPermission();
    setHasRequestedPermission(true);
    if (res === 'granted') {
      try {
        new Notification(currentPopup.title, {
          body: currentPopup.body,
          icon: '/icons/icon-192.png',
        });
      } catch {
        // ignore
      }
    }
  };

  const is1HourReminder =
    currentPopup.title.includes('1 Hour Left') ||
    currentPopup.title.includes('Hour Left') ||
    currentPopup.type === 'deadline_urgent';
  const is100Percent =
    currentPopup.title.includes('100% Completed') ||
    currentPopup.title.includes('Perfect Day');
  const isIncomplete =
    currentPopup.title.includes('Not Completed') ||
    currentPopup.title.includes('%');

  const config = is1HourReminder
    ? {
        border: 'border-[var(--color-warning)]/40',
        accentBg: 'bg-[var(--color-warning)]/15 text-[var(--color-warning)]',
        barColor: 'bg-[var(--color-warning)]',
        icon: <Clock size={16} className="text-[var(--color-warning)] animate-pulse" />,
        badgeText: '1-Hour Task Reminder',
      }
    : is100Percent
    ? {
        border: 'border-[var(--color-primary)]/40',
        accentBg: 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]',
        barColor: 'bg-[var(--color-primary)]',
        icon: <Sparkles size={16} className="text-[var(--color-primary)] animate-pulse" />,
        badgeText: 'Daily Completion Goal Achieved',
      }
    : isIncomplete
    ? {
        border: 'border-[var(--color-warning)]/40',
        accentBg: 'bg-[var(--color-warning)]/15 text-[var(--color-warning)]',
        barColor: 'bg-[var(--color-warning)]',
        icon: <Zap size={16} className="text-[var(--color-warning)] animate-bounce" />,
        badgeText: '9:00 PM Habit Check-in',
      }
    : {
        border: 'border-[var(--color-primary)]/40',
        accentBg: 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]',
        barColor: 'bg-[var(--color-primary)]',
        icon: <Bell size={16} className="text-[var(--color-primary)]" />,
        badgeText: 'Notification',
      };

  return (
    <aside
      role="alert"
      aria-live="assertive"
      data-testid="notification-popup-toast"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`fixed top-4 right-4 sm:right-6 z-50 max-w-sm w-[calc(100%-2rem)] glass p-4 rounded-2xl border ${config.border} bg-[var(--color-surface)] shadow-xl animate-in slide-in-from-top-4 duration-300`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {config.icon}
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${config.accentBg}`}>
            {config.badgeText}
          </span>
        </div>
        <button
          type="button"
          onClick={dismissPopup}
          aria-label="Dismiss notification popup"
          className="p-1 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* Title & Body */}
      <div className="mb-3">
        <h4 className="text-fluid-sm font-bold mb-0.5 leading-snug" style={{ color: 'var(--color-text)' }}>
          {currentPopup.title}
        </h4>
        <p className="text-fluid-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          {currentPopup.body}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleMarkRead}
          className="flex-1 py-1.5 px-3 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold text-fluid-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
        >
          <Check size={14} />
          <span>Got it</span>
        </button>

        {canRequestPush && (
          <button
            type="button"
            onClick={handleEnablePush}
            title="Enable browser system notifications"
            className="py-1.5 px-2.5 rounded-xl bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] text-[var(--color-text)] text-fluid-xs flex items-center gap-1 transition-all border border-[var(--color-border)]"
          >
            <Volume2 size={13} />
            <span>Enable Push</span>
          </button>
        )}

        <button
          type="button"
          onClick={dismissPopup}
          className="px-2.5 py-1.5 rounded-xl text-fluid-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          Close
        </button>
      </div>

      {/* Auto-dismiss progress timer */}
      <div className="w-full bg-[var(--color-surface-hover)] h-1 rounded-full mt-3 overflow-hidden border border-[var(--color-border)]">
        <div
          className={`h-full transition-all duration-100 ease-linear ${config.barColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </aside>
  );
};
