import { Card, CardContent, Grid, Typography } from '@mui/material';

const Home = () => {
  const roles = [
    'Admin Dashboard',
    'Teacher Dashboard',
    'Student Dashboard',
    'Parent Dashboard'
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Welcome to SchoolOS
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This frontend is powered by React and Material UI. Use the navigation to explore role-specific dashboards and features as they are implemented.
        </Typography>
      </Grid>
      {roles.map((role) => (
        <Grid item xs={12} md={6} key={role}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {role}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Placeholder content for the {role.toLowerCase()}. Upcoming tasks will flesh out data visualizations, management tools, and communications tailored to this role.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Home;
