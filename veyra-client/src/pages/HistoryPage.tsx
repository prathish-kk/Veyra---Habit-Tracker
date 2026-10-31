/** History archive browser page — Year/Month tree navigation and locked snapshots (Corbel theme). */
import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { useHistoryTree, MonthCard } from '@/features/history';
import { Archive, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/cn';

export const HistoryPage: React.FC = () => {
  const { tree, years, isLoading } = useHistoryTree();
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const activeYearData = tree.find((t) => t.year === selectedYear) || tree[0];
  const months = activeYearData?.months ?? [];
  const totalCompletedInYear = activeYearData?.totalCompleted ?? 0;

  return (
    <AppShell>
      <PageHeader
        title="Permanent History & Archive"
        subtitle="Browse your immutable monthly snapshots, past reflections, and longitudinal growth."
      />

      {/* Top Archive Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="glass p-4 rounded-2xl border border-[var(--color-border)] flex items-center justify-between">
          <div>
            <div className="text-fluid-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              Archived Months
            </div>
            <div className="text-fluid-2xl font-black mt-0.5" style={{ color: 'var(--color-text)' }}>
              {months.length}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center">
            <Archive size={24} />
          </div>
        </div>

        <div className="glass p-4 rounded-2xl border border-[var(--color-border)] flex items-center justify-between">
          <div>
            <div className="text-fluid-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              Annual Habits Logged
            </div>
            <div className="text-fluid-2xl font-black mt-0.5" style={{ color: 'var(--color-text)' }}>
              {totalCompletedInYear.toLocaleString()}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="glass p-4 rounded-2xl border border-[var(--color-border)] flex items-center justify-between">
          <div>
            <div className="text-fluid-xs font-semibold uppercase tracking-wider text-[var(--color-warning)]">
              Snapshots Locked
            </div>
            <div className="text-fluid-2xl font-black mt-0.5" style={{ color: 'var(--color-text)' }}>
              {months.filter((m) => m.isLocked).length}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[var(--color-warning)]/15 text-[var(--color-warning)] flex items-center justify-center">
            <Lock size={24} />
          </div>
        </div>
      </div>

      {/* Year Selection Tabs */}
      {years.length > 1 && (
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3 mb-6">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={cn(
                'px-4 py-2 rounded-xl text-fluid-xs font-bold transition-all border',
                selectedYear === y
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
                  : 'border-transparent hover:bg-[var(--color-surface-hover)]'
              )}
              style={selectedYear === y ? {} : { color: 'var(--color-text-muted)' }}
            >
              {y} Archive
            </button>
          ))}
        </div>
      )}

      {/* Monthly Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass p-5 rounded-2xl border border-[var(--color-border)] h-64 animate-pulse" />
          ))}
        </div>
      ) : months.length === 0 ? (
        <div className="glass p-12 rounded-3xl border border-[var(--color-border)] text-center">
          <Archive size={48} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
          <h3 className="text-fluid-lg font-bold mb-1" style={{ color: 'var(--color-text)' }}>No archives yet</h3>
          <p className="text-fluid-xs" style={{ color: 'var(--color-text-muted)' }}>
            At the end of each month, your progress locks into a permanent snapshot.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {months.map((month) => (
            <MonthCard key={`${month.year}-${month.month}`} month={month} />
          ))}
        </div>
      )}
    </AppShell>
  );
};
