/** Modal to list every user with a direct Add Friend button and optional search filter. */
import React, { useState } from 'react';
import { UserPlus, X, Search, Sparkles, Loader2, Users } from 'lucide-react';
import { GlassInput } from '@/components/glass/GlassInput';
import { useFriends } from '../hooks/useFriends';
import { DiscoverUserCard } from './DiscoverUserCard';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (payload: { targetUsername: string }) => Promise<unknown>;
}

export const AddFriendModal: React.FC<AddFriendModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { discoverUsers, isLoadingDiscover, sendRequest, respondToRequest } = useFriends();
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filteredUsers = discoverUsers.filter((u) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    const nameMatch = u.name?.toLowerCase().includes(q);
    const usernameMatch = u.username?.toLowerCase().includes(q);
    return nameMatch || usernameMatch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

      {/* Modal Dialog */}
      <div
        className="glass-heavy relative z-10 w-full max-w-xl max-h-[85vh] flex flex-col p-6 rounded-3xl border border-[var(--glass-border)] shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--glass-border)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-primary/15 text-primary border border-primary/30">
              <UserPlus size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-fluid-lg font-bold text-gray-900 dark:text-white">Find & Add Friends</h2>
                <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-gray-700 dark:text-zinc-300 text-[11px] font-semibold">
                  {discoverUsers.length} users
                </span>
              </div>
              <p className="text-fluid-xs text-gray-600 dark:text-zinc-400">
                Connect with any member of the Veyra community below
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search / Filter bar */}
        <div className="pt-4 pb-3 shrink-0 relative">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400" />
            <input
              type="text"
              placeholder="Quick filter by name or @username..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 text-fluid-xs focus:outline-none focus:border-primary transition-colors"
            />
            {filterQuery && (
              <button
                type="button"
                onClick={() => setFilterQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Users List with Direct Add Buttons */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[220px]">
          {isLoadingDiscover ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-zinc-400">
              <Loader2 size={28} className="animate-spin text-primary mb-2" />
              <p className="text-fluid-xs">Loading community members...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-gray-500 dark:text-zinc-400 space-y-2">
              <Users size={36} className="mx-auto text-gray-400 dark:text-zinc-600 mb-1" />
              <p className="text-fluid-sm font-semibold text-gray-900 dark:text-white">No users match "{filterQuery}"</p>
              <p className="text-fluid-xs text-gray-500 dark:text-zinc-500">
                Try clearing your search to see all community members.
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <DiscoverUserCard
                key={user.id}
                user={user}
                onAddFriend={async (targetUsername) => {
                  await sendRequest({ targetUsername });
                }}
                onAcceptRequest={async (requestId) => {
                  await respondToRequest({ requestId, action: 'accept' });
                }}
              />
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-[var(--glass-border)] flex items-center justify-between text-fluid-xs text-gray-500 dark:text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-zinc-400">
            <Sparkles size={12} className="text-amber-500 dark:text-yellow-400" />
            <span>Connect to share streaks, compare XP & climb leaderboards</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-[var(--glass-border)] bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-900 dark:text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
