import {
  Box,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import EmptyState from '../components/common/EmptyState';
import { getAssignments } from '../services/assignments';

const AssignmentsPage = () => {
  const theme = useTheme();
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { data, isLoading } = useQuery({ queryKey: ['assignments'], queryFn: getAssignments });
  const assignments = data ?? [];

  return (
    <Stack spacing={4} component="section" aria-label="Assignments queue">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Assignments
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review submissions and stay ahead of grading deadlines.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          {isLoading ? (
            <Stack spacing={2}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} variant="rounded" height={56} />
              ))}
            </Stack>
          ) : assignments.length === 0 ? (
            <EmptyState
              title="No assignments yet"
              description="Start by creating an assignment so students can submit their work."
              actionLabel="New assignment"
              onAction={() => null}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Due</TableCell>
                  <TableCell align="right">Submissions</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow
                    key={assignment.id}
                    hover={!reduceMotion}
                    sx={{ transition: reduceMotion ? 'none' : theme.transitions.create('background-color') }}
                  >
                    <TableCell>{assignment.title}</TableCell>
                    <TableCell>{assignment.course}</TableCell>
                    <TableCell>{dayjs(assignment.dueDate).format('MMM D, YYYY h:mm A')}</TableCell>
                    <TableCell align="right">
                      {assignment.submissions}/{assignment.totalStudents}
                    </TableCell>
                    <TableCell align="right">
                      <Chip label={assignment.status} size="small" color="primary" variant="outlined" />
                    </TableCell>
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

export default AssignmentsPage;
