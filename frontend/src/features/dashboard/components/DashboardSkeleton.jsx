import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material';

const srOnly = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0
};

const DashboardSkeleton = () => {
  return (
    <Stack spacing={3}>
      <Typography component="h1" sx={srOnly}>
        Loading dashboard overview
      </Typography>
      <Grid container spacing={3}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={12} sm={6} lg={3} key={`stat-skeleton-${index}`}>
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="60%" height={48} />
              <Skeleton variant="text" width="50%" />
            </Box>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2, mt: 2 }} />
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2, mt: 2 }} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3 }}>
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2, mt: 2 }} />
            <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2, mt: 2 }} />
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default DashboardSkeleton;
