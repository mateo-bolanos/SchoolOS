import {
  Box,
  Chip,
  Paper,
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
import { useMemo } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import EmptyState from '../components/states/EmptyState';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { getGradebookBySection } from '../services/courses';

const Gradebook = () => {
  const { id } = useParams();
  const theme = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['gradebook', id],
    queryFn: () => getGradebookBySection(id),
    enabled: Boolean(id)
  });

  const average = useMemo(() => {
    if (!data?.scores?.length) {
      return null;
    }

    const sum = data.scores.reduce((total, score) => total + score.average, 0);
    return Math.round(sum / data.scores.length);
  }, [data?.scores]);

  if (isLoading) {
    return (
      <Paper sx={{ p: 4 }}>
        <Skeleton variant="text" width="50%" height={38} />
        <Skeleton variant="text" width="30%" height={24} sx={{ mt: 1 }} />
        <Skeleton variant="rectangular" height={240} sx={{ mt: 3, borderRadius: 3 }} />
      </Paper>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Gradebook unavailable"
        description="We're having trouble loading this section's gradebook. Try again soon or contact your system admin."
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="Section not found"
        description="We couldn't locate that section. Return to your course to pick a different gradebook."
        action={
          <Chip component={RouterLink} to="/dashboard" label="Return to dashboard" clickable color="primary" />
        }
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {data.courseTitle}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Section {data.sectionId} • Monitoring scholar mastery and submissions.
        </Typography>
        {average !== null ? (
          <Chip
            label={`Class average ${average}%`}
            size="small"
            variant="outlined"
            sx={{
              mt: 2,
              fontWeight: 600,
              color:
                average >= 85
                  ? theme.palette.success.dark
                  : average >= 70
                    ? theme.palette.warning.dark
                    : theme.palette.error.dark,
              borderColor:
                average >= 85
                  ? theme.palette.success.main
                  : average >= 70
                    ? theme.palette.warning.main
                    : theme.palette.error.main,
              backgroundColor: 'transparent',
              '& .MuiChip-label': {
                color: 'inherit',
                fontWeight: 600,
                px: 1
              }
            }}
          />
        ) : null}
      </Box>

      <Paper sx={{ overflowX: 'auto' }}>
        <Table aria-label="Gradebook table">
          <TableHead>
            <TableRow>
              <TableCell>Scholar</TableCell>
              <TableCell>Latest submission</TableCell>
              <TableCell align="right">Average</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.scores.map((score) => {
              const isAtRisk = score.atRisk;
              const chipBackground = isAtRisk ? theme.palette.error.dark : theme.palette.success.dark;
              const chipTextColor = theme.palette.getContrastText(chipBackground);

              return (
                <TableRow
                  key={score.student}
                  hover={!prefersReducedMotion}
                  sx={{ transition: prefersReducedMotion ? 'none' : 'background-color 180ms ease' }}
                >
                  <TableCell>{score.student}</TableCell>
                  <TableCell>
                    {new Date(score.latestSubmission).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell align="right">{score.average}%</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={isAtRisk ? 'At risk' : 'On track'}
                      size="small"
                      sx={{
                        bgcolor: chipBackground,
                        color: chipTextColor,
                        fontWeight: 600,
                        '& .MuiChip-label': {
                          color: 'inherit',
                          fontWeight: 600,
                          px: 1
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
};

export default Gradebook;
