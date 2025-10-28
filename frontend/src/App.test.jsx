import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import theme from './theme';
import { routes } from './routes/router';

describe('App Router', () => {
  it('renders the welcome headline on the home route', () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] });

    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    );

    expect(screen.getByText(/Welcome to SchoolOS/i)).toBeInTheDocument();
  });
});
