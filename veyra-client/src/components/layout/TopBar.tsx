/** TopBar — responsive app header with notification bell, streak badge, and user drawer. */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Flame, User as UserIcon, Menu } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useStreaks } from '@/features/gamification';
import { useNotifications, NotificationDrawer } from '@/features/notifications';
import { cn } from '@/lib/cn';

interface TopBarProps {
  onOpenMobileNav?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileNav }) => {
  const { user } = useAuth();
  const { dailyStreak } = useStreaks();
  const { unreadCount } = useNotifications();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-30 glass border-b px-[var(--page-padding)] flex items-center justify-between"
        style={{
          height: 'var(--topbar-height)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* Left: Mobile Hamburger & Brand / Desktop Welcome Title */}
        <div className="flex items-center gap-2.5">
          {/* Mobile Left Section Nav Bar Toggle Button */}
          <button
            type="button"
            onClick={onOpenMobileNav}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 rounded-xl transition-all flex items-center justify-center"
            style={{
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface-hover)',
            }}
          >
            <Menu size={18} />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm"
              style={{ background: 'var(--color-text)', color: 'var(--color-text-on-dark)' }}
            >
              V
            </div>
            <span className="font-bold text-fluid-sm tracking-tight" style={{ color: 'var(--color-text)' }}>Veyra</span>
          </Link>
          <div className="hidden lg:block text-fluid-xs" style={{ color: 'var(--color-text-muted)' }}>
            Welcome to <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>Veyra Productivity</span>
          </div>
        </div>

        {/* Right: Notification Bell & Profile Avatar with Streak */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Notification Bell Button */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open notifications drawer"
            className="relative p-2 rounded-xl transition-all"
            style={{
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center shadow-lg animate-pulse"
                style={{ background: 'var(--color-primary)', color: 'var(--color-text-on-primary)' }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Pill with Streak directly before our name */}
          {user && (
            <Link
              to="/profile"
              className="flex items-center gap-2 p-1 pl-2 sm:pl-2.5 rounded-xl text-fluid-xs transition-colors group"
              style={{
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
              }}
            >
              {/* Daily Streak Badge directly before our name */}
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg font-bold text-[11px] transition-colors"
                title={`Current Daily Streak: ${dailyStreak} day${dailyStreak === 1 ? '' : 's'}`}
                style={{
                  background: 'var(--color-accent-soft)',
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <Flame size={12} style={{ color: 'var(--color-primary)' }} />
                <span className="tabular-nums">{dailyStreak}d</span>
              </div>

              <span className="font-medium hidden sm:inline max-w-[120px] truncate" style={{ color: 'var(--color-text)' }}>
                {user.name || user.username || 'Adventurer'}
              </span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
                style={{ background: 'var(--color-text)', color: 'var(--color-text-on-dark)' }}
              >
                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </div>
            </Link>
          )}
        </div>
      </header>

      {/* Notifications Drawer */}
      <NotificationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};
