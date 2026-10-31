/**
 * MobileNavDrawer — Elegant left slide-out navigation bar specifically for mobile view.
 * Provides instant access to all tabs (Weekly Plan, Monthly Goals, Calendar, History,
 * Challenges, Leaderboard, Settings, etc.) without altering desktop view.
 */
import React, { useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  CalendarCheck,
  CalendarRange,
  Target,
  Calendar,
  History,
  Users,
  Trophy,
  Award,
  Bell,
  Settings,
  User as UserIcon,
  LogOut,
  Flame,
  ChevronRight,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useStreaks, useGamification } from '@/features/gamification';
import { useNotifications } from '@/features/notifications';
import { BrandLogo } from '@/components/common/BrandLogo';
import { UserAvatar } from '@/components/common/UserAvatar';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavSection {
  title: string;
  items: {
    to: string;
    label: string;
    description: string;
    icon: LucideIcon;
    badge?: string | number | null;
    isPrimary?: boolean;
  }[];
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { dailyStreak } = useStreaks();
  const { level, progressPercentage } = useGamification();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  // Close drawer automatically on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate('/login');
  };

  const navSections: NavSection[] = [
    {
      title: 'Planning & Routines',
      items: [
        {
          to: '/daily',
          label: 'Daily Habits',
          description: "Today's check-ins & scheduled times",
          icon: CalendarCheck,
          isPrimary: true,
        },
        {
          to: '/weekly',
          label: 'Weekly Plan',
          description: 'Focus sprint & Sunday planning',
          icon: CalendarRange,
        },
        {
          to: '/monthly',
          label: 'Monthly Goals',
          description: 'Milestones & monthly review',
          icon: Target,
        },
        {
          to: '/calendar',
          label: 'Calendar Heatmap',
          description: 'Month visual completion grid',
          icon: Calendar,
        },
        {
          to: '/history',
          label: 'History & Archive',
          description: 'Past logs, months & trends',
          icon: History,
        },
        {
          to: '/dashboard',
          label: 'Analytics Dashboard',
          description: 'Overall growth telemetry',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Community & Compete',
      items: [
        {
          to: '/challenges',
          label: 'Challenges & Quests',
          description: 'Sprint races with friends',
          icon: Trophy,
        },
        {
          to: '/leaderboard',
          label: 'Leaderboard',
          description: 'Top XP rankings & tiers',
          icon: Award,
        },
        {
          to: '/friends',
          label: 'Friends & Social',
          description: 'Activity feed & accountability',
          icon: Users,
        },
      ],
    },
    {
      title: 'Personal & System',
      items: [
        {
          to: '/notifications',
          label: 'Notifications',
          description: 'Activity updates & alerts',
          icon: Bell,
          badge: unreadCount > 0 ? unreadCount : null,
        },
        {
          to: '/profile',
          label: 'Player Profile',
          description: 'Badges, level & statistics',
          icon: UserIcon,
        },
        {
          to: '/settings',
          label: 'App Settings',
          description: 'Preferences, notifications & sound',
          icon: Settings,
        },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-start lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Left Drawer Panel */}
      <aside
        className="relative z-10 w-[84%] max-w-[340px] h-full flex flex-col border-r shadow-2xl animate-in slide-in-from-left duration-300 overflow-hidden"
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
        aria-label="Mobile Navigation"
      >
        {/* Header Section */}
        <div className="p-4 sm:p-5 border-b flex items-center justify-between relative z-10" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <BrandLogo size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-fluid-base tracking-tight" style={{ color: 'var(--color-text)' }}>Veyra</span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: 'var(--color-primary-soft)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  MOBILE
                </span>
              </div>
              <span className="text-[11px] block font-medium" style={{ color: 'var(--color-text-muted)' }}>Navigation Menu</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-all active:scale-95"
            aria-label="Close menu"
            style={{
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface-hover)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* User Card Profile Widget */}
        {user && (
          <div
            className="p-3.5 mx-3.5 mt-3.5 rounded-2xl border shadow-sm relative z-10"
            style={{
              background: 'var(--color-surface-hover)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <NavLink
                to="/profile"
                onClick={onClose}
                className="flex items-center gap-2.5 min-w-0 hover:opacity-85 transition-opacity"
              >
                <UserAvatar
                  src={user.avatarUrl}
                  name={user.name || user.username || 'Adventurer'}
                  size="md"
                />
                <div className="min-w-0">
                  <div className="text-fluid-xs font-semibold truncate" style={{ color: 'var(--color-text)' }}>
                    {user.name || user.username || 'Adventurer'}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="font-medium" style={{ color: 'var(--color-primary)' }}>Lvl {level || user.level || 1}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 font-semibold" style={{ color: 'var(--color-primary)' }}>
                      <Flame size={11} /> {dailyStreak}d
                    </span>
                  </div>
                </div>
              </NavLink>

              <NavLink
                to="/profile"
                onClick={onClose}
                className="p-1.5 rounded-lg transition-colors"
                title="View Profile"
                style={{ color: 'var(--color-text-muted)', background: 'var(--color-surface)' }}
              >
                <ChevronRight size={16} />
              </NavLink>
            </div>

            {/* Level XP mini progress bar */}
            <div className="mt-2.5 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center justify-between text-[10px] mb-1" style={{ color: 'var(--color-text-muted)' }}>
                <span>Level Progress</span>
                <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{progressPercentage}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(0, progressPercentage))}%`,
                    background: 'var(--color-primary)',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5 relative z-10">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <div className="px-2.5 text-[10px] font-bold tracking-wider uppercase" style={{ color: 'var(--color-text-muted)' }}>
                {section.title}
              </div>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-fluid-xs font-medium transition-all group border"
                      style={({ isActive }) => ({
                        background: isActive ? 'var(--color-primary-soft)' : 'transparent',
                        color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        borderColor: isActive ? 'var(--color-border-strong)' : 'transparent',
                      })}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="p-1.5 rounded-lg transition-colors shrink-0"
                          style={{
                            background: 'var(--color-surface-hover)',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold truncate leading-tight" style={{ color: 'var(--color-text)' }}>
                            {item.label}
                          </div>
                          <div className="text-[10px] truncate leading-tight mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                            {item.description}
                          </div>
                        </div>
                      </div>

                      {/* Badge if any */}
                      {item.badge != null && (
                        <span
                          className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 shadow-sm"
                          style={{ background: 'var(--color-primary)', color: 'var(--color-text-on-primary)' }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Area with Sign Out & Version Info */}
        <div className="p-3.5 border-t mt-auto relative z-10 space-y-2" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
          {user && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-fluid-xs font-medium transition-all"
              style={{
                color: 'var(--color-danger)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface-hover)',
              }}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          )}

          <div className="text-center text-[10px] flex items-center justify-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ background: 'var(--color-success)' }} />
            <span>Veyra Cloud Synced</span>
          </div>
        </div>
      </aside>
    </div>
  );
};
