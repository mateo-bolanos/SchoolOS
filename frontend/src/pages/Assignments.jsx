import {
  Box,
  Chip,
  Paper,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import EmptyState from '../components/states/EmptyState';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { listAssignments, listCourses } from '../services/courses';
import getStatusChipStyles from '../utils/getStatusChipStyles';

const STATUS_OPTIONS = ['all', 'open', 'submitted', 'grading', 'draft'];

const Assignments = () => {
  const theme = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [status, setStatus] = useState('all');

  const {
    data: assignments,
    isLoading: assignmentsLoading,
    isError: assignmentsError
  } = useQuery({ queryKey: ['assignments'], queryFn: listAssignments });

  const { data: courses } = useQuery({ queryKey: ['courses'], queryFn: listCourses });

  const courseTitles = useMemo(() => {
    if (!courses?.length) {
      return {};
    }

    return courses.reduce((acc, course) => {
      acc[course.id] = course.title;
      return acc;
    }, {});
  }, [courses]);

  const filteredAssignments = useMemo(() => {
    if (!assignments?.length) {
      return [];
    }

    if (status === 'all') {
      return assignments;
    }

    return assignments.filter((assignment) => assignment.status === status);
  }, [assignments, status]);

  if (assignmentsLoading) {
    return (
      <Paper sx={{ p: 4 }}>
        <Skeleton variant="text" width="30%" height={38} />
        <Skeleton variant="text" width="50%" height={24} sx={{ mt: 1 }} />
        <Stack spacing={2} mt={3}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={`assignment-row-${index}`} variant="rectangular" height={84} sx={{ borderRadius: 3 }} />
          ))}
        </Stack>
      </Paper>
    );
  }

  if (assignmentsError) {
    return (
      <EmptyState
        title="Assignments are taking longer than expected"
        description="Please try again later. If the issue persists, connect with your administrator."
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Assignments
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track progress and follow up on submissions across your scholar roster.
        </Typography>
      </Box>

      <ToggleButtonGroup
        value={status}
        exclusive
        onChange={(_, value) => value && setStatus(value)}
        aria-label="Assignment status filter"
      >
        {STATUS_OPTIONS.map((option) => (
          <ToggleButton key={option} value={option} aria-label={option} sx={{ textTransform: 'capitalize' }}>
            {option}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {filteredAssignments.length ? (
        <Stack spacing={2}>
          {filteredAssignments.map((assignment) => (
            <Paper
              key={assignment.id}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'space-between',
                transition: prefersReducedMotion ? 'none' : 'transform 180ms ease, box-shadow 180ms ease',
                '&:hover': {
                  transform: prefersReducedMotion ? 'none' : 'translateY(-2px)',
                  boxShadow: prefersReducedMotion ? 'none' : 4
                }
              }}
            >
              <Box>
                <Typography variant="h6">{assignment.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {courseTitles[assignment.courseId] ?? assignment.courseId} • Due{' '}
                  {new Date(assignment.dueDate).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </Typography>
              </Box>
              <Stack direction={{ xs: 'row', sm: 'column' }} spacing={1} alignItems={{ xs: 'center', sm: 'flex-end' }}>
                <Chip
                  label={assignment.status}
                  size="small"
                  variant="outlined"
                  sx={getStatusChipStyles(assignment.status, theme)}
                />
                <Typography variant="body2" color="text.secondary">
                  {assignment.submissions} submitted • {assignment.needsReview} to review
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : (
        <EmptyState
          title="No assignments match this filter"
          description="Switch filters or create a new assignment to see it appear here."
        />
      )}
    </Stack>
  );
};

export default Assignments;
