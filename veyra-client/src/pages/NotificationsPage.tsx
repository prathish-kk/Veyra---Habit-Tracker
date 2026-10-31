/** Notifications Center page with filter tabs, push permission toggle, and real-time updates (Corbel theme). */
import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  useNotifications,
  NotificationCard,
  requestNotificationPermission,
} from '@/features/notifications';
import {
  Bell,
  CheckCheck,
  BellRing,
  Inbox,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export const NotificationsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [pushStatus, setPushStatus] = useState<string>(() =>
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'unsupported'
  );

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(filter === 'unread');

  const handleEnablePush = async () => {
    const perm = await requestNotificationPermission();
    setPushStatus(perm);
  };

  return (
    <AppShell>
      <PageHeader
        title="Notification Center"
        subtitle="Stay updated on friend requests, challenge milestones, daily streak alerts, and leveling rewards."
      />

      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="glass p-4 rounded-2xl border border-[var(--color-border)] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
              Unread Alerts
            </div>
            <div className="text-fluid-2xl font-black mt-0.5" style={{ color: 'var(--color-text)' }}>{unreadCount}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center">
            <Bell size={24} />
          </div>
        </div>

        <div className="glass p-4 rounded-2xl border border-[var(--color-border)] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
              Total Recorded
            </div>
            <div className="text-fluid-2xl font-black mt-0.5" style={{ color: 'var(--color-text)' }}>{notifications.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center">
            <Inbox size={24} />
          </div>
        </div>

        <div className="glass p-4 rounded-2xl border border-[var(--color-border)] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-warning)]">
              Web Push Delivery
            </div>
            <div className="text-fluid-xs font-bold mt-1 capitalize" style={{ color: 'var(--color-text)' }}>
              {pushStatus === 'granted' ? 'Enabled' : pushStatus}
            </div>
          </div>
          {pushStatus !== 'granted' && pushStatus !== 'unsupported' ? (
            <button
              onClick={handleEnablePush}
              className="px-3 py-1.5 rounded-xl bg-[var(--color-warning)]/15 hover:bg-[var(--color-warning)]/25 text-[var(--color-warning)] border border-[var(--color-warning)]/30 text-[11px] font-bold transition-all"
            >
              Enable
            </button>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-[var(--color-warning)]/15 text-[var(--color-warning)] flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs and Actions Bar */}
      <div className="glass p-3.5 rounded-2xl border border-[var(--color-border)] mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-4 py-2 rounded-xl text-fluid-xs font-bold transition-all border',
              filter === 'all'
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
                : 'border-transparent hover:bg-[var(--color-surface-hover)]'
            )}
            style={filter === 'all' ? {} : { color: 'var(--color-text-muted)' }}
          >
            All Notifications
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={cn(
              'px-4 py-2 rounded-xl text-fluid-xs font-bold transition-all border flex items-center gap-1.5',
              filter === 'unread'
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
                : 'border-transparent hover:bg-[var(--color-surface-hover)]'
            )}
            style={filter === 'unread' ? {} : { color: 'var(--color-text-muted)' }}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="text-fluid-xs text-[var(--color-primary)] hover:underline font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass p-5 rounded-2xl border border-[var(--color-border)] h-20 animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="glass p-12 rounded-3xl border border-[var(--color-border)] text-center">
            <BellRing size={48} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
            <h3 className="text-fluid-lg font-bold mb-1" style={{ color: 'var(--color-text)' }}>
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </h3>
            <p className="text-fluid-xs" style={{ color: 'var(--color-text-muted)' }}>
              When friends send invites or you reach streaks and milestones, alerts will appear here.
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              onMarkAsRead={(id) => markAsRead(id)}
              onDelete={(id) => deleteNotification(id)}
            />
          ))
        )}
      </div>
    </AppShell>
  );
};
