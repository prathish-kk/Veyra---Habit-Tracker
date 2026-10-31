import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, Users, User, Compass } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMobileNav?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMobileNav }) => {
  const tabs = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/daily', label: 'Habits', icon: CalendarCheck },
    { to: '/friends', label: 'Social', icon: Users },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 lg:hidden glass-heavy border-t select-none"
      style={{
        height: 'calc(var(--bottom-nav-height, 64px) + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        borderColor: 'var(--color-border)',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
      }}
    >
      <div className="flex items-center justify-around h-[var(--bottom-nav-height,64px)] px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className="flex flex-col items-center justify-center flex-1 h-full min-h-[44px] text-[10.5px] font-medium transition-colors touch-manipulation"
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: isActive ? 600 : 500,
              })}
            >
              <Icon size={19} className="mb-0.5 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </NavLink>
          );
        })}

        {/* 5th Tab: Open Left Section Nav Bar for All Other Tabs */}
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="flex flex-col items-center justify-center flex-1 h-full min-h-[44px] text-[10.5px] font-medium transition-colors active:scale-95 group touch-manipulation"
          aria-label="Open all tabs menu"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <Compass size={19} className="mb-0.5 shrink-0" />
          <span className="truncate">More</span>
        </button>
      </div>
    </nav>
  );
};
