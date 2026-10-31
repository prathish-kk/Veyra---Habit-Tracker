/** BackgroundOrbs — subtle warm gradient orbs for visual depth. */
import React from 'react';

export const BackgroundOrbs: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Top-right orb: warm sage */}
      <div
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-float"
        style={{ background: 'var(--color-primary-soft)', opacity: 0.4 }}
      />

      {/* Bottom-left orb: subtle warm */}
      <div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl animate-float"
        style={{ background: 'var(--color-accent-soft)', opacity: 0.3, animationDelay: '2s' }}
      />

      {/* Center orb: very subtle */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl animate-float"
        style={{ background: 'var(--color-primary-soft)', opacity: 0.2, animationDelay: '4s' }}
      />
    </div>
  );
};
