import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import AppShell from './components/layout/AppShell';

const App = () => {
  return (
    <AppShell>
      <Suspense
        fallback={(
          <Box
            role="status"
            aria-live="polite"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '40vh'
            }}
          >
            <CircularProgress size={32} aria-label="Loading content" />
          </Box>
        )}
      >
        <Outlet />
      </Suspense>
    </AppShell>
  );
};

export default App;
