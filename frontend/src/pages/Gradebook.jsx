import { useParams } from 'react-router-dom';
import {
  Box,
  Chip,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/TrendingUpRounded';
import ArrowDownwardIcon from '@mui/icons-material/TrendingDownRounded';
import ArrowForwardIcon from '@mui/icons-material/TrendingFlatRounded';
import useGradebook from '../features/gradebook/useGradebook';
import EmptyState from '../components/common/EmptyState';

const TrendIconMap = {
  up: ArrowUpwardIcon,
  down: ArrowDownwardIcon,
  stable: ArrowForwardIcon
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

const GradebookSkeleton = () => (
  <Stack spacing={3}>
    <Typography component="h1" sx={srOnly}>
      Loading gradebook
    </Typography>
    <Skeleton variant="text" width="40%" />
    <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 3 }} />
  </Stack>
);

const GradebookPage = () => {
  const { sectionId } = useParams();
  const { data, isLoading, isError, refetch } = useGradebook(sectionId);

  if (isLoading) {
    return <GradebookSkeleton />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Gradebook unavailable"
        description="We're unable to load the gradebook right now. Please try again shortly."
        actionLabel="Retry"
        onAction={refetch}
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4" component="h1">
          {data.courseName} · Gradebook
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Weighted categories:{' '}
          {data.gradingCategories.map((category) => `${category.name} ${category.weight}%`).join(' · ')}
        </Typography>
      </Stack>
      <Paper variant="outlined" sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell align="center">Average</TableCell>
                <TableCell align="center">Trend</TableCell>
                <TableCell align="center">Missing work</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.students.map((student) => {
                const TrendIcon = TrendIconMap[student.trend];

                return (
                  <TableRow key={student.id} hover>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {student.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack spacing={1} alignItems="center">
                        <Typography variant="body1" fontWeight={600}>
                          {student.average}%
                        </Typography>
                        <Box sx={{ width: '100%', maxWidth: 220 }}>
                          <LinearProgress
                            variant="determinate"
                            value={student.average}
                            color={student.average >= 85 ? 'success' : student.average >= 70 ? 'warning' : 'error'}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={<TrendIcon fontSize="small" />}
                        label={student.trend === 'stable' ? 'Steady' : student.trend === 'up' ? 'Improving' : 'Declining'}
                        color={student.trend === 'up' ? 'success' : student.trend === 'down' ? 'error' : 'default'}
                        variant={student.trend === 'stable' ? 'outlined' : 'filled'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {student.missing > 0 ? (
                        <Chip color="warning" label={`${student.missing} missing`} />
                      ) : (
                        <Chip color="success" variant="outlined" label="On track" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
};

export default GradebookPage;
