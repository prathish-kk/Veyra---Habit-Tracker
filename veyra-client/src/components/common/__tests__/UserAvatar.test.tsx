import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserAvatar } from '../UserAvatar';

describe('UserAvatar', () => {
  it('renders initial when no src is provided', () => {
    render(<UserAvatar name="Sarah Connor" size="md" />);
    const avatar = screen.getByTestId('ui-avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveTextContent('S');
  });

  it('renders fallback initial "U" when no name is provided', () => {
    render(<UserAvatar size="sm" />);
    const avatar = screen.getByTestId('ui-avatar');
    expect(avatar).toHaveTextContent('U');
  });

  it('renders image when src is valid', () => {
    render(<UserAvatar src="https://example.com/avatar.png" name="John Doe" size="lg" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.png');
    expect(img).toHaveAttribute('alt', 'John Doe');
  });

  it('falls back to initial when image fails to load', () => {
    render(<UserAvatar src="https://example.com/broken.png" name="Alex Vance" size="md" />);
    const img = screen.getByRole('img');
    fireEvent.error(img);

    // After image error, should display initial
    expect(screen.getByTestId('ui-avatar')).toHaveTextContent('A');
  });

  it('renders custom children if passed', () => {
    render(
      <UserAvatar size="md">
        <span>VIP</span>
      </UserAvatar>
    );
    expect(screen.getByText('VIP')).toBeInTheDocument();
  });
});

