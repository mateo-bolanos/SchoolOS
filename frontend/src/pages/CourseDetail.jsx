import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link as RouterLink } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';
import { getCourseDetail } from '../services/courses';

const CourseDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({ queryKey: ['course', id], queryFn: () => getCourseDetail(id) });

  if (isError) {
    return (
      <EmptyState
        title="Course unavailable"
        description="We couldn\'t load this course. Try refreshing or contact support if the issue persists."
        actionLabel="Back to dashboard"
        onAction={() => window.history.back()}
      />
    );
  }

  return (
    <Stack spacing={4} component="section" aria-label="Course detail">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {isLoading ? <Skeleton width={240} /> : data.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isLoading ? <Skeleton width="60%" /> : data.description}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          {isLoading ? (
            <Stack spacing={2}>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="rounded" height={120} />
            </Stack>
          ) : (
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6">Sections</Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={2}>
                  {data.sections.map((section) => (
                    <Box key={section.id} display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {section.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {section.schedule}
                        </Typography>
                      </Box>
                      <Chip
                        component={RouterLink}
                        to={`/sections/${section.id}/gradebook`}
                        clickable
                        label="View gradebook"
                        color="primary"
                      />
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Divider />
              <Typography variant="body2" color="text.secondary">
                {data.students} enrolled students
              </Typography>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default CourseDetailPage;
