import { useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import CalendarIcon from '@mui/icons-material/EventNoteRounded';
import DescriptionIcon from '@mui/icons-material/DescriptionRounded';
import useCourseDetail from '../features/courses/useCourseDetail';
import EmptyState from '../components/common/EmptyState';

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

const CourseDetailSkeleton = () => (
  <Stack spacing={3}>
    <Typography component="h1" sx={srOnly}>
      Loading course details
    </Typography>
    <Skeleton variant="text" width="40%" />
    <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
      </Grid>
    </Grid>
  </Stack>
);

const CourseDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useCourseDetail(id);

  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Course unavailable"
        description="We couldn't retrieve the course details. Please refresh or try again later."
        actionLabel="Retry"
        onAction={refetch}
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4" component="h1">
          {data.name}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip color="primary" label={data.code} />
          <Chip variant="outlined" label={data.term} />
        </Stack>
      </Stack>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack direction="row" spacing={2}>
          <DescriptionIcon color="primary" />
          <Typography variant="body1" color="text.secondary">
            {data.description}
          </Typography>
        </Stack>
      </Paper>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <CalendarIcon color="primary" />
              <Typography variant="h6">Schedule</Typography>
            </Stack>
            <Stack spacing={1.5}>
              {data.schedule.map((entry) => (
                <Box key={`${entry.day}-${entry.time}`}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {entry.day}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {entry.time} · {entry.location}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              Teaching team
            </Typography>
            <Stack spacing={2}>
              {data.instructors.map((instructor) => (
                <Stack key={instructor.id} direction="row" spacing={2} alignItems="center">
                  <Avatar alt={instructor.name} src={`https://i.pravatar.cc/80?u=${instructor.id}`} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {instructor.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {instructor.role}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent announcements
        </Typography>
        <Stack spacing={2} divider={<Divider flexItem />}>
          {data.announcements.map((announcement) => (
            <Box key={announcement.id}>
              <Typography variant="subtitle1" fontWeight={600}>
                {announcement.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(announcement.postedAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {announcement.excerpt}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default CourseDetailPage;
