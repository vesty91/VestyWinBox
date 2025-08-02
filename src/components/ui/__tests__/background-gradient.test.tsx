import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BackgroundGradient } from '../background-gradient';

describe('BackgroundGradient', () => {
  it('renders children correctly', () => {
    render(
      <BackgroundGradient>
        <div data-testid="test-child">Test Content</div>
      </BackgroundGradient>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <BackgroundGradient className="custom-class">
        <div>Content</div>
      </BackgroundGradient>
    );

    const container = screen.getByText('Content').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('applies custom containerClassName', () => {
    render(
      <BackgroundGradient containerClassName="container-custom-class">
        <div>Content</div>
      </BackgroundGradient>
    );

    const wrapper = screen.getByText('Content').closest('.group');
    expect(wrapper).toHaveClass('container-custom-class');
  });

  it('renders without animation when animate is false', () => {
    render(
      <BackgroundGradient animate={false}>
        <div>Content</div>
      </BackgroundGradient>
    );

    const wrapper = screen.getByText('Content').closest('.group');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders with animation by default', () => {
    render(
      <BackgroundGradient>
        <div>Content</div>
      </BackgroundGradient>
    );

    const wrapper = screen.getByText('Content').closest('.group');
    expect(wrapper).toBeInTheDocument();
  });

  it('has correct structure with gradient layers', () => {
    render(
      <BackgroundGradient>
        <div>Content</div>
      </BackgroundGradient>
    );

    const wrapper = screen.getByText('Content').closest('.group');
    expect(wrapper).toHaveClass('group', 'relative', 'p-[4px]');
  });
}); 