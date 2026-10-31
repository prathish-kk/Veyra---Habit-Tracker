/** Avatar — shared UI primitive component with theme-aware defaults. */
import React from 'react';
import { UserAvatar, type UserAvatarSize } from '@/components/common/UserAvatar';

export { UserAvatar };
export type { UserAvatarSize };

export const Avatar: React.FC<{
  children?: React.ReactNode;
  src?: string | null;
  name?: string | null;
  size?: UserAvatarSize;
  className?: string;
}> = ({ children, src, name, size, className }) => {
  return (
    <UserAvatar src={src} name={name} size={size} className={className}>
      {children}
    </UserAvatar>
  );
};
