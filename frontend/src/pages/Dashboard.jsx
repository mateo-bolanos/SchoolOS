import { Grid, Stack, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/SchoolRounded';
import useDashboardOverview from '../features/dashboard/useDashboardOverview';
import DashboardSkeleton from '../features/dashboard/components/DashboardSkeleton';
import StatCard from '../features/dashboard/components/StatCard';
import UpcomingLessonsCard from '../features/dashboard/components/UpcomingLessonsCard';
import StudentAlertsCard from '../features/dashboard/components/StudentAlertsCard';
import HighlightsCard from '../features/dashboard/components/HighlightsCard';
import EmptyState from '../components/common/EmptyState';

const DashboardPage = () => {
  const { data, isLoading, isError, refetch } = useDashboardOverview();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Dashboard unavailable"
        description="We couldn't load the latest activity. Please try again in a moment."
        actionLabel="Retry"
        onAction={refetch}
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} alignItems="center">
          <SchoolIcon color="primary" />
          <Typography variant="h4" component="h1">
            Welcome back, Jordan
          </Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary">
          Here's a snapshot of what's happening across your classes today.
        </Typography>
      </Stack>
      <Grid container spacing={3}>
        {data.stats.map((stat) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.id}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <UpcomingLessonsCard lessons={data.upcomingLessons} />
        </Grid>
        <Grid item xs={12} md={6}>
          <StudentAlertsCard students={data.atRiskStudents} />
        </Grid>
      </Grid>
      <HighlightsCard highlights={data.highlights} />
    </Stack>
  );
};

export default DashboardPage;
