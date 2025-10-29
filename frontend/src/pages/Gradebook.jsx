import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import EmptyState from '../components/common/EmptyState';
import { getGradebook } from '../services/gradebook';

dayjs.extend(relativeTime);

const GradebookPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({ queryKey: ['gradebook', id], queryFn: () => getGradebook(id) });

  if (isError) {
    return (
      <EmptyState
        title="Gradebook unavailable"
        description="We couldn\'t load this gradebook. Try refreshing or contact support."
        actionLabel="Back to dashboard"
        onAction={() => window.history.back()}
      />
    );
  }

  return (
    <Stack spacing={4} component="section" aria-label="Gradebook">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {isLoading ? <Skeleton width={260} /> : `${data.courseTitle} • Gradebook`}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isLoading ? <Skeleton width="40%" /> : `${data.term} • Section ${id}`}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          {isLoading ? (
            <Stack spacing={2}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <Skeleton key={idx} variant="rounded" height={48} />
              ))}
            </Stack>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell align="right">Average</TableCell>
                  <TableCell align="right">Last submission</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.students.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>{student.name}</TableCell>
                    <TableCell align="right">{student.average}%</TableCell>
                    <TableCell align="right">{dayjs(student.lastSubmission).fromNow()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default GradebookPage;
