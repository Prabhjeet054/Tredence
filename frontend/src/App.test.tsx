import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the top bar title area', () => {
    render(<App />);
    expect(screen.getByDisplayValue('Untitled Workflow')).toBeInTheDocument();
  });
});
