import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardStatus, { getStatusTone } from './components/DashboardStatus.jsx';

describe('DashboardStatus component', () => {
  it('renders label and percentage with accessible roles', () => {
    render(<DashboardStatus label="Attendance" value={92} />);

    expect(
      screen.getByRole('heading', { name: /attendance/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('92%');
    expect(screen.getByText('On track')).toBeInTheDocument();
  });

  it('applies warning tone when value is below threshold', () => {
    render(<DashboardStatus label="Grades" value={60} threshold={80} />);

    expect(screen.getByText('Needs attention')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveStyle({ color: '#ed6c02' });
  });
});

describe('getStatusTone helper', () => {
  it('returns the expected tone buckets', () => {
    expect(getStatusTone(90, 80)).toBe('status-positive');
    expect(getStatusTone(55, 80)).toBe('status-warning');
    expect(getStatusTone(20, 80)).toBe('status-critical');
  });
});
