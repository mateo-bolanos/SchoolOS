import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import theme from './theme';
import { routes } from './routes/router';

describe('App Router', () => {
  it('renders the dashboard headline on the default route', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] });

    const queryClient = new QueryClient();

    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    );

    expect(await screen.findByRole('heading', { level: 1, name: /dashboard/i })).toBeInTheDocument();
    expect(await screen.findByText(/scholar engagement/i)).toBeInTheDocument();
  });
});
