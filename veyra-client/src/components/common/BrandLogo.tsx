/**
 * BrandLogo — dynamically adapts between Light and Dark mode.
 * In Light Mode: Deep charcoal tile (#1A1A1A) with crisp white 'V' mark.
 * In Dark Mode: Luminous sage tile (#A3B18A) with charcoal 'V' mark.
 */
import React from 'react';
import { cn } from '@/lib/cn';

export type BrandLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface BrandLogoProps {
  size?: BrandLogoSize;
  showWordmark?: boolean;
  subtitle?: string;
  className?: string;
}

const sizeConfig: Record<BrandLogoSize, { box: string; text: string; radius: string; wordmarkText: string }> = {
  xs: { box: 'w-7 h-7', text: 'text-xs', radius: 'rounded-lg', wordmarkText: 'text-fluid-sm' },
  sm: { box: 'w-8 h-8', text: 'text-sm', radius: 'rounded-xl', wordmarkText: 'text-fluid-sm' },
  md: { box: 'w-9 h-9', text: 'text-base', radius: 'rounded-xl', wordmarkText: 'text-fluid-base' },
  lg: { box: 'w-10 h-10', text: 'text-xl', radius: 'rounded-xl', wordmarkText: 'text-xl' },
  xl: { box: 'w-12 h-12', text: 'text-2xl', radius: 'rounded-2xl', wordmarkText: 'text-2xl' },
  '2xl': { box: 'w-16 h-16 sm:w-20 sm:h-20', text: 'text-3xl sm:text-4xl', radius: 'rounded-2xl sm:rounded-3xl', wordmarkText: 'text-fluid-4xl' },
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showWordmark = false,
  subtitle,
  className,
}) => {
  const cfg = sizeConfig[size] || sizeConfig.md;

  const badge = (
    <div
      aria-label="Veyra"
      className={cn(
        cfg.box,
        cfg.radius,
        'flex items-center justify-center font-bold tracking-tight shadow-sm shrink-0 transition-colors duration-200 select-none',
        cfg.text
      )}
      style={{
        background: 'var(--color-logo-bg)',
        color: 'var(--color-logo-text)',
        border: '1px solid var(--color-logo-border)',
      }}
    >
      V
    </div>
  );

  if (!showWordmark) {
    return <div className={cn('inline-flex items-center', className)}>{badge}</div>;
  }

  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      {badge}
      <div className="flex flex-col">
        <span
          className={cn('font-bold tracking-tight leading-none', cfg.wordmarkText)}
          style={{ color: 'var(--color-text)' }}
        >
          Veyra
        </span>
        {subtitle && (
          <span className="text-[11px] block font-medium mt-1 leading-none" style={{ color: 'var(--color-primary)' }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

