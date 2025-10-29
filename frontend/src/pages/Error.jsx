import { Box, Button, Typography } from '@mui/material';
import { useRouteError, Link as RouterLink } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <Box textAlign="center" py={8}>
      <Typography variant="h3" gutterBottom>
        Something went wrong
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {error?.statusText || error?.message || 'An unexpected error occurred.'}
      </Typography>
      <Button component={RouterLink} to="/dashboard" variant="contained" color="primary">
        Go to dashboard
      </Button>
    </Box>
  );
};

export default ErrorPage;
