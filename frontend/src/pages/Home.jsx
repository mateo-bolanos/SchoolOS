import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  const quickLinks = [
    {
      title: 'Gradebook',
      description:
        'Monitor live grade averages, category weightings, and grading tasks across classrooms.',
      actionLabel: 'Open Gradebook',
      href: '/dashboard/gradebook'
    },
    {
      title: 'Assignments',
      description:
        'Review upcoming assignments, submission progress, and follow-up actions for each class.',
      actionLabel: 'View Assignments',
      href: '/dashboard/assignments'
    }
  ];

  return (
    <Grid component="section" container spacing={3} aria-labelledby="dashboard-heading">
      <Grid item xs={12}>
        <Stack spacing={1}>
          <Typography id="dashboard-heading" variant="h4" component="h1" gutterBottom>
            Welcome to SchoolOS
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This dashboard aggregates critical operations for administrators, teachers, students, and parents. Use the quick
            links below to jump directly into the gradebook or assignments workspaces.
          </Typography>
        </Stack>
      </Grid>
      {quickLinks.map((link) => (
        <Grid item xs={12} md={6} key={link.title}>
          <Card component="article" elevation={1}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                {link.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {link.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button
                component={RouterLink}
                to={link.href}
                variant="contained"
                color="primary"
                aria-label={link.actionLabel}
              >
                {link.actionLabel}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Home;
