/** GlassButton — styled button with touch-friendly sizing (Corbel theme). */
import React from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const variantClass =
    variant === 'primary'
      ? 'glass-button-primary'
      : variant === 'secondary'
      ? 'border'
      : variant === 'ghost'
      ? 'glass-button-ghost'
      : 'glass-button-primary';

  const variantStyle =
    variant === 'secondary'
      ? { borderColor: 'var(--color-border)', background: 'var(--color-surface-hover)', color: 'var(--color-text)' }
      : variant === 'danger'
      ? { background: 'var(--color-danger)', color: '#fff', border: 'none' }
      : undefined;

  const sizeClass =
    size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm';

  return (
    <button className={cn('glass-button', variantClass, sizeClass, className)} style={variantStyle} {...props}>
      {children}
    </button>
  );
};
