import {
  Box,
  Button,
  Chip,
  Divider,
  Fade,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  HorizontalRuleRounded,
  RefreshRounded
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import EmptyState from '../components/states/EmptyState';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { getDashboardData } from '../services/dashboard';
import getStatusChipStyles from '../utils/getStatusChipStyles';

const metricFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1
});

const trendIconMap = {
  up: ArrowUpwardRounded,
  down: ArrowDownwardRounded,
  flat: HorizontalRuleRounded
};

const Dashboard = () => {
  const theme = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
    staleTime: 5 * 60 * 1000
  });

  const metrics = data?.metrics ?? [];
  const assignments = data?.upcomingAssignments ?? [];
  const courses = data?.spotlightCourses ?? [];
  const messages = data?.recentMessages ?? [];

  const renderMetricCard = (metric) => {
    const TrendIcon = metric.delta ? trendIconMap[metric.delta.trend] : null;
    const trendColor =
      metric.delta?.trend === 'down'
        ? theme.palette.error.dark
        : metric.delta?.trend === 'flat'
          ? theme.palette.text.secondary
          : theme.palette.success.dark;
    const value = metric.unit === '%' ? `${metricFormatter.format(metric.value)}%` : metricFormatter.format(metric.value);

    return (
      <Fade in timeout={prefersReducedMotion ? 0 : 400} key={metric.id}>
        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%' }}>
          <Typography variant="subtitle1" component="p" color="text.secondary">
            {metric.label}
          </Typography>
          <Typography variant="h3" component="p" color="text.primary">
            {value}
          </Typography>
          {metric.delta ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              {TrendIcon ? (
                <TrendIcon
                  fontSize="small"
                  sx={{ color: metric.delta.trend === 'down' ? theme.palette.error.dark : theme.palette.success.dark }}
                />
              ) : null}
              <Typography variant="body2" sx={{ color: trendColor, fontWeight: 600 }}>
                {metric.delta.trend === 'flat' ? 'Stable' : `${metric.delta.trend === 'down' ? '-' : '+'}${metricFormatter.format(metric.delta.value)}%`}
              </Typography>
            </Stack>
          ) : null}
        </Paper>
      </Fade>
    );
  };

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          A quick snapshot of scholar engagement, communications, and upcoming priorities.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={12} md={6} lg={3} key={`metric-skeleton-${index}`}>
                <Paper sx={{ p: 3 }}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="50%" height={42} sx={{ mt: 1 }} />
                  <Skeleton variant="text" width="40%" height={20} sx={{ mt: 2 }} />
                </Paper>
              </Grid>
            ))
          : metrics.map((metric) => (
              <Grid item xs={12} md={6} lg={3} key={metric.id}>
                {renderMetricCard(metric)}
              </Grid>
            ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" component="h2">
                Upcoming assignments
              </Typography>
              <Button
                size="small"
                onClick={() => refetch()}
                startIcon={<RefreshRounded fontSize="small" />}
                disabled={isLoading}
              >
                Refresh
              </Button>
            </Stack>
            {isLoading ? (
              <Stack spacing={2}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <Box key={`assignment-skeleton-${index}`}>
                    <Skeleton variant="text" width="70%" height={24} />
                    <Skeleton variant="text" width="50%" height={18} />
                  </Box>
                ))}
              </Stack>
            ) : isError ? (
              <EmptyState
                title="We couldn't load assignments"
                description="Please refresh to try again. If the issue persists, check your network connection or contact support."
                action={
                  <Button variant="contained" onClick={() => refetch()} startIcon={<RefreshRounded />}>
                    Retry
                  </Button>
                }
              />
            ) : assignments.length ? (
              <Stack spacing={1.5}>
                {assignments.map((assignment) => (
                  <Paper
                    key={assignment.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 2,
                      flexWrap: 'wrap',
                      bgcolor: 'background.paper',
                      borderColor: 'divider',
                      borderStyle: 'solid',
                      borderWidth: 1
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" component="p" fontWeight={600}>
                        {assignment.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {assignment.course} • Due{' '}
                        {new Date(assignment.dueDate).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Box>
                    <Chip
                      label={assignment.status}
                      size="small"
                      variant="outlined"
                      sx={getStatusChipStyles(assignment.status, theme)}
                    />
                  </Paper>
                ))}
              </Stack>
            ) : (
              <EmptyState
                title="No assignments queued"
                description="When assignments are published, they will appear here with their due dates and status."
              />
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Stack spacing={3} height="100%">
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Spotlight courses
              </Typography>
              {isLoading ? (
                <Stack spacing={2}>
                  {Array.from({ length: 2 }).map((_, index) => (
                    <Box key={`course-skeleton-${index}`}>
                      <Skeleton variant="text" width="80%" height={24} />
                      <Skeleton variant="text" width="60%" height={18} />
                    </Box>
                  ))}
                </Stack>
              ) : courses.length ? (
                <Stack spacing={2}>
                  {courses.map((course) => (
                    <Box
                      key={course.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: prefersReducedMotion ? 'none' : 'transform 180ms ease, box-shadow 180ms ease',
                        '&:hover': {
                          transform: prefersReducedMotion ? 'none' : 'translateY(-2px)',
                          boxShadow: prefersReducedMotion ? 'none' : 4
                        }
                      }}
                    >
                      <Typography variant="subtitle1" component="p" fontWeight={600}>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course.instructor}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.success.dark, fontWeight: 600 }}>
                        Engagement {course.engagement}%
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <EmptyState
                  title="No spotlight courses"
                  description="Mark a course as spotlight to feature it for your academic team."
                />
              )}
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Recent messages
              </Typography>
              {isLoading ? (
                <Stack spacing={2}>
                  {Array.from({ length: 2 }).map((_, index) => (
                    <Box key={`message-skeleton-${index}`}>
                      <Skeleton variant="text" width="70%" height={24} />
                      <Skeleton variant="text" width="90%" height={18} />
                    </Box>
                  ))}
                </Stack>
              ) : messages.length ? (
                <List disablePadding>
                  {messages.map((message, index) => (
                    <ListItem
                      key={message.id}
                      alignItems="flex-start"
                      disableGutters
                      divider={index < messages.length - 1}
                      sx={{ flexDirection: 'column', alignItems: 'stretch', px: 0, py: 1.5 }}
                    >
                      <ListItemText
                        sx={{ px: 2 }}
                        primaryTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                        primary={message.subject}
                        secondary={`${message.from} • ${new Date(message.receivedAt).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}`}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ px: 2, pt: 1.5 }}>
                        {message.preview}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <EmptyState
                  title="Inbox is clear"
                  description="When teams send updates, they will land here so you never miss an important message."
                />
              )}
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Dashboard;
