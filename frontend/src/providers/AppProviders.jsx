import PropTypes from 'prop-types';
import { useState } from 'react';
import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from '../theme';

const QueryClientWithToasts = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [queryClient] = useState(() => {
    const queryCache = new QueryCache({
      onError: (error, query) => {
        if (query?.meta?.silent) {
          return;
        }

        const message =
          (error instanceof Error && error.message) || 'Something went wrong. Please try again later.';

        enqueueSnackbar(message, {
          variant: 'error',
          preventDuplicate: true
        });
      }
    });

    return new QueryClient({
      queryCache,
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: false,
          staleTime: 1000 * 60
        }
      }
    });
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

QueryClientWithToasts.propTypes = {
  children: PropTypes.node.isRequired
};

const AppProviders = ({ children }) => {
  return (
    <StyledEngineProvider injectFirst>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        dense
      >
        <QueryClientWithToasts>
          <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            {children}
          </ThemeProvider>
        </QueryClientWithToasts>
      </SnackbarProvider>
    </StyledEngineProvider>
  );
};

AppProviders.propTypes = {
  children: PropTypes.node.isRequired
};

export default AppProviders;
