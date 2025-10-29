import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import EmptyState from '../components/states/EmptyState';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { getCourseById } from '../services/courses';

const formatMeetingTime = (startTime, endTime) => {
  return `${startTime} - ${endTime}`;
};

const CourseDetail = () => {
  const { id } = useParams();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourseById(id),
    enabled: Boolean(id)
  });

  const sectionLinks = useMemo(() => {
    if (!data?.sections?.length) {
      return [];
    }

    return data.sections.map((section) => ({
      id: section.id,
      label: section.label,
      to: `/sections/${section.id}/gradebook`
    }));
  }, [data?.sections]);

  if (isLoading) {
    return (
      <Paper sx={{ p: 4 }}>
        <Skeleton variant="text" width="40%" height={38} />
        <Skeleton variant="text" width="80%" height={24} sx={{ mt: 1 }} />
        <Skeleton variant="rectangular" height={160} sx={{ mt: 3, borderRadius: 3 }} />
      </Paper>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="We couldn't load that course"
        description="Please refresh or return to the dashboard while we work on restoring this view."
        action={
          <Button variant="contained" component={RouterLink} to="/dashboard">
            Back to dashboard
          </Button>
        }
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="Course not found"
        description="The course you're looking for may have been archived or you might not have access to it."
        action={
          <Button variant="contained" component={RouterLink} to="/dashboard">
            Browse courses
          </Button>
        }
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {data.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth={720}>
            {data.description}
          </Typography>
          <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
            {data.meetingDays.map((day) => (
              <Chip key={day} label={day} color="primary" variant="outlined" size="small" />
            ))}
          </Stack>
        </Box>
        {sectionLinks.length ? (
          <Button
            component={RouterLink}
            to={sectionLinks[0].to}
            variant="contained"
            color="primary"
            sx={{ whiteSpace: 'nowrap' }}
          >
            Open gradebook
          </Button>
        ) : null}
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, display: 'grid', gap: 2 }}>
            <Typography variant="h6" component="h2">
              Course logistics
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Instructor
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {data.instructor}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Schedule
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formatMeetingTime(data.startTime, data.endTime)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {data.room}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Enrolled scholars
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {data.students}
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Box>
              <Typography variant="subtitle2" component="h3" color="text.secondary" gutterBottom>
                Sections
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {sectionLinks.length ? (
                  sectionLinks.map((section) => (
                    <Chip
                      key={section.id}
                      label={`${section.label} • ${data.sections.find((item) => item.id === section.id)?.enrollment ?? 0} scholars`}
                      component={RouterLink}
                      to={section.to}
                      clickable
                      variant="outlined"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No sections available.
                  </Typography>
                )}
              </Stack>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              transition: prefersReducedMotion ? 'none' : 'transform 180ms ease, box-shadow 180ms ease',
              '&:hover': {
                transform: prefersReducedMotion ? 'none' : 'translateY(-4px)',
                boxShadow: prefersReducedMotion ? 'none' : 6
              }
            }}
          >
            <Typography variant="h6" component="h2">
              Next steps
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Use this space to publish weekly agendas, share resources, and monitor scholar progress.
            </Typography>
            <Button variant="outlined" component={RouterLink} to="/assignments">
              Manage assignments
            </Button>
            <Button variant="outlined" component={RouterLink} to="/messages">
              Message families
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default CourseDetail;
