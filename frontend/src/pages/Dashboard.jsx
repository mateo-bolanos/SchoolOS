import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import EmptyState from '../components/common/EmptyState';
import { getDashboardSummary } from '../services/dashboard';

dayjs.extend(relativeTime);

const DashboardPage = () => {
  const theme = useTheme();
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboardSummary });

  const stats = data?.stats ?? [];
  const upcoming = data?.upcoming ?? [];
  const courseUpdates = data?.courseUpdates ?? [];

  return (
    <Stack spacing={4} component="section" aria-label="Dashboard overview">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Today&apos;s briefing
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor class activity, upcoming assignments, and student momentum at a glance.
        </Typography>
      </Box>

      <Grid container spacing={3} aria-label="Key metrics">
        {(isLoading ? Array.from({ length: 3 }) : stats).map((stat, index) => (
          <Grid item xs={12} md={4} key={stat?.id ?? index}>
            <Card sx={{
              borderRadius: 3,
              transition: reduceMotion ? 'none' : theme.transitions.create('transform', {
                duration: theme.transitions.duration.short,
                easing: theme.transitions.easing.easeOut
              }),
              '&:hover': {
                transform: reduceMotion ? 'none' : 'translateY(-4px)'
              }
            }}>
              <CardContent>
                {isLoading ? (
                  <Stack spacing={1.5}>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" sx={{ fontSize: '2.5rem' }} />
                    <Skeleton variant="text" width="50%" />
                  </Stack>
                ) : (
                  <Stack spacing={1}>
                    <Typography variant="overline" color="text.secondary">
                      {stat.label}
                    </Typography>
                    <Typography variant="h3">{stat.value}</Typography>
                    {stat.delta && (
                      <Chip
                        size="small"
                        color="secondary"
                        label={stat.delta}
                        sx={{ alignSelf: 'flex-start' }}
                      />
                    )}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Upcoming work</Typography>
                <Chip label="Next 7 days" size="small" color="primary" variant="outlined" />
              </Stack>
              {isLoading ? (
                <Stack spacing={2}>
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton key={idx} variant="rounded" height={72} />
                  ))}
                </Stack>
              ) : upcoming.length === 0 ? (
                <EmptyState
                  title="No assignments due"
                  description="Students are all caught up. Create a new assignment to keep momentum going."
                  actionLabel="Create assignment"
                  onAction={() => null}
                />
              ) : (
                <List disablePadding>
                  {upcoming.map((item) => (
                    <ListItem key={item.id} divider>
                      <ListItemText
                        primary={item.title}
                        secondary={`${item.course} • due ${dayjs(item.dueDate).fromNow()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Course pulse
              </Typography>
              {isLoading ? (
                <Stack spacing={2}>
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton key={idx} variant="rounded" height={72} />
                  ))}
                </Stack>
              ) : courseUpdates.length === 0 ? (
                <EmptyState
                  title="No recent activity"
                  description="Students haven\'t checked in recently. Send a message to nudge them."
                  actionLabel="Compose message"
                  onAction={() => null}
                />
              ) : (
                <Stack spacing={2}>
                  {courseUpdates.map((course) => (
                    <Box
                      key={course.id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 3,
                        p: 2,
                        transition: reduceMotion
                          ? 'none'
                          : theme.transitions.create('border-color', {
                              duration: theme.transitions.duration.shorter
                            }),
                        '&:hover': {
                          borderColor: theme.palette.primary.main
                        }
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {course.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {course.section} • Active {dayjs(course.lastActivity).fromNow()}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress * 100}
                        sx={{ borderRadius: 2, height: 8 }}
                      />
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default DashboardPage;
