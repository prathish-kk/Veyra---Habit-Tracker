/**
 * NotFoundPage — Branded, helpful 404 error page.
 * Guides lost users back to safety with intelligent destinations,
 * glassmorphic visual cues, and contextual shortcuts.
 */
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { GlassButton } from '@/components/glass/GlassButton';
import {
  Compass,
  Home,
  ArrowLeft,
  CalendarCheck,
  LayoutDashboard,
  Target,
  Users,
  Search,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const helpfulDestinations = isAuthenticated
    ? [
        {
          to: '/daily',
          title: 'Daily Habits',
          description: "Check in on today's scheduled routines",
          icon: CalendarCheck,
          accent: 'text-primary group-hover:bg-primary/20 group-hover:text-primary-hover',
        },
        {
          to: '/dashboard',
          title: 'Analytics Dashboard',
          description: 'View your streaks, XP level & weekly graph',
          icon: LayoutDashboard,
          accent: 'text-primary group-hover:bg-primary/20 group-hover:text-primary-hover',
        },
        {
          to: '/monthly',
          title: 'Monthly Goals',
          description: 'Review milestones & monthly plans',
          icon: Target,
          accent: 'text-primary group-hover:bg-primary/20 group-hover:text-primary-hover',
        },
        {
          to: '/challenges',
          title: 'Challenges & Quests',
          description: 'Compete in community sprints',
          icon: Trophy,
          accent: 'text-amber-500 group-hover:bg-amber-500/20 group-hover:text-amber-400',
        },
      ]
    : [
        {
          to: '/',
          title: 'Homepage',
          description: 'Discover the Veyra habit building platform',
          icon: Home,
          accent: 'text-primary group-hover:bg-primary/20 group-hover:text-primary-hover',
        },
        {
          to: '/login',
          title: 'Sign In',
          description: 'Access your habits, streaks & saved routines',
          icon: Sparkles,
          accent: 'text-primary group-hover:bg-primary/20 group-hover:text-primary-hover',
        },
        {
          to: '/register',
          title: 'Create Account',
          description: 'Start tracking habits with gamification today',
          icon: Target,
          accent: 'text-emerald-500 group-hover:bg-emerald-500/20 group-hover:text-emerald-400',
        },
        {
          to: '/about',
          title: 'About Veyra',
          description: 'Learn about our philosophy & privacy-first design',
          icon: Compass,
          accent: 'text-primary group-hover:bg-primary/20 group-hover:text-primary-hover',
        },
      ];

  return (
    <PublicLayout>
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fadeIn relative">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="glass p-6 sm:p-10 w-full max-w-xl rounded-3xl border border-[var(--glass-border)] shadow-2xl text-center relative overflow-hidden">
          {/* Top Brand Banner */}
          <div
            className="absolute top-0 inset-x-0 h-1"
            style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' }}
          />

          {/* 404 Floating Compass Badge */}
          <div className="mb-5 relative inline-block">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-inner relative group">
              <Compass size={42} className="animate-spin duration-1000" style={{ animationDuration: '18s' }} />
              <div className="absolute inset-0 rounded-3xl bg-primary/20 animate-ping opacity-25" />
            </div>
            <div className="text-6xl sm:text-7xl font-black text-black/5 dark:text-white/5 absolute -bottom-6 inset-x-0 select-none tracking-tighter">
              404
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-300 text-[11px] font-semibold mb-3">
            <span>Route Not Found</span>
            <span className="text-gray-400 dark:text-zinc-500">•</span>
            <span className="font-mono text-gray-700 dark:text-zinc-300 max-w-[160px] truncate">{location.pathname}</span>
          </div>

          <h1 className="text-fluid-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
            Lost in the Productivity Void?
          </h1>

          <p className="text-fluid-xs text-gray-600 dark:text-zinc-300 max-w-md mx-auto mb-6 leading-relaxed">
            The link you followed doesn't exist, has been moved, or may have been archived. Don't worry — your habits, streaks, and progress are safe.
          </p>

          {/* Main Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="w-full sm:w-auto">
              <GlassButton variant="primary" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5">
                <Home size={16} />
                <span>{isAuthenticated ? 'Go to Dashboard' : 'Back to Home'}</span>
              </GlassButton>
            </Link>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[var(--glass-border)] bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-fluid-xs font-medium text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </button>
          </div>

          {/* Helpful Destination Quick Links */}
          <div className="pt-6 border-t border-[var(--glass-border)] text-left">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-3 text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles size={12} className="text-primary" />
              <span>Helpful Destinations</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {helpfulDestinations.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] border border-[var(--glass-border)] hover:border-primary/30 transition-all group flex items-start gap-3"
                  >
                    <div className={`p-2 rounded-xl bg-black/5 dark:bg-white/5 ${item.accent} transition-colors shrink-0`}>
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-fluid-xs font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-zinc-400 line-clamp-1 leading-tight mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
