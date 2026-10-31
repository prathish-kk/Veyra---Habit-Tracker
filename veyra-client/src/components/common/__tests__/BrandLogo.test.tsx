import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrandLogo } from '../BrandLogo';

describe('BrandLogo', () => {
  it('renders the logo mark with accessible label', () => {
    render(<BrandLogo size="md" />);
    const badge = screen.getByLabelText('Veyra');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('V');
  });

  it('renders with wordmark and subtitle when enabled', () => {
    render(<BrandLogo size="lg" showWordmark subtitle="Build & Track" />);
    expect(screen.getByText('Veyra')).toBeInTheDocument();
    expect(screen.getByText('Build & Track')).toBeInTheDocument();
  });

  it('applies responsive size classes correctly', () => {
    const { container: containerSm } = render(<BrandLogo size="xs" />);
    expect(containerSm.querySelector('.w-7')).toBeInTheDocument();

    const { container: containerXl } = render(<BrandLogo size="xl" />);
    expect(containerXl.querySelector('.w-12')).toBeInTheDocument();
  });
});

