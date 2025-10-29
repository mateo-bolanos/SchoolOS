import {
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import dayjs from '../lib/dayjs';
import useAssignments from '../features/assignments/useAssignments';
import EmptyState from '../components/common/EmptyState';

const statusColor = {
  'In progress': 'primary',
  Scheduled: 'info',
  'Needs review': 'warning'
};

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

const AssignmentsSkeleton = () => (
  <Stack spacing={3}>
    <Typography component="h1" sx={srOnly}>
      Loading assignments
    </Typography>
    <Skeleton variant="text" width="40%" />
    {Array.from({ length: 3 }).map((_, index) => (
      <Skeleton key={`assignment-skeleton-${index}`} variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
    ))}
  </Stack>
);

const AssignmentsPage = () => {
  const { data, isLoading, isError, refetch } = useAssignments();

  if (isLoading) {
    return <AssignmentsSkeleton />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Assignments unavailable"
        description="We couldn't fetch the latest assignments. Please try again shortly."
        actionLabel="Retry"
        onAction={refetch}
      />
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title="No assignments scheduled"
        description="Create a new assignment to keep students engaged."
        actionLabel="Create assignment"
        onAction={() => {}}
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        Assignments
      </Typography>
      <Stack spacing={2}>
        {data.map((assignment) => {
          const color = statusColor[assignment.status] ?? 'default';
          const submittedPercent = Math.round((assignment.submissions / assignment.totalStudents) * 100);

          return (
            <Card key={assignment.id} variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <Box>
                      <Typography variant="h6">{assignment.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {assignment.course}
                      </Typography>
                    </Box>
                    <Chip color={color} variant={color === 'default' ? 'outlined' : 'filled'} label={assignment.status} />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Due {dayjs(assignment.dueDate).format('MMM D, h:mm A')}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={submittedPercent}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {assignment.submissions} of {assignment.totalStudents} submitted
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default AssignmentsPage;
