/**
 * UserAvatar — dynamically theme-adaptive profile picture component.
 * In Light Mode:
 *   - Image: framed by warm neutral border (--color-avatar-border: #D8E0D2)
 *   - Initials: soft sage cream background (#E8EDE4) with deep sage text (#4F5E44)
 * In Dark Mode:
 *   - Image: framed by moss charcoal border (--color-avatar-border: #3A4532)
 *   - Initials: deep moss charcoal background (#2A3024) with radiant sage text (#A3B18A)
 */
import React, { useState } from 'react';
import { cn } from '@/lib/cn';

export type UserAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: UserAvatarSize;
  className?: string;
  alt?: string;
  children?: React.ReactNode;
}

const sizeClasses: Record<UserAvatarSize, { box: string; text: string; radius: string }> = {
  xs: { box: 'w-7 h-7', text: 'text-xs', radius: 'rounded-lg' },
  sm: { box: 'w-8 h-8', text: 'text-xs', radius: 'rounded-xl' },
  md: { box: 'w-9 h-9 sm:w-10 sm:h-10', text: 'text-sm', radius: 'rounded-xl' },
  lg: { box: 'w-12 h-12', text: 'text-base', radius: 'rounded-2xl' },
  xl: { box: 'w-14 h-14', text: 'text-xl', radius: 'rounded-2xl' },
  '2xl': { box: 'w-20 h-20 sm:w-24 sm:h-24', text: 'text-3xl font-bold', radius: 'rounded-2xl' },
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  size = 'md',
  className,
  alt,
  children,
}) => {
  const [imageError, setImageError] = useState(false);
  const cfg = sizeClasses[size] || sizeClasses.md;

  const initial = (name || 'U').trim().charAt(0).toUpperCase() || 'U';
  const showImage = Boolean(src && !imageError);

  return (
    <div
      data-testid="ui-avatar"
      className={cn(
        cfg.box,
        cfg.radius,
        'relative flex items-center justify-center font-bold shrink-0 select-none overflow-hidden shadow-sm transition-colors duration-200',
        cfg.text,
        className
      )}
      style={{
        background: 'var(--color-avatar-bg)',
        color: 'var(--color-avatar-text)',
        border: '1px solid var(--color-avatar-border)',
      }}
    >
      {showImage ? (
        <img
          src={src as string}
          alt={alt || name || 'User profile'}
          className={cn('w-full h-full object-cover', cfg.radius)}
          onError={() => setImageError(true)}
        />
      ) : (
        children || initial
      )}
    </div>
  );
};

