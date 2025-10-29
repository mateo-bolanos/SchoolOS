import { Breadcrumbs, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';

const metrics = [
  {
    label: 'Average course grade',
    value: '92%',
    description: 'Weighted across all assignments submitted this term.'
  },
  {
    label: 'Assignments needing review',
    value: '4',
    description: 'Submissions awaiting feedback from instructors.'
  },
  {
    label: 'Students below target',
    value: '3',
    description: 'Learners below the intervention threshold of 70%.'
  }
];

const Gradebook = () => {
  return (
    <Stack component="section" spacing={3} aria-labelledby="gradebook-heading">
      <Breadcrumbs aria-label="Breadcrumb">
        <Link component={RouterLink} color="inherit" to="/dashboard">
          Dashboard
        </Link>
        <Typography color="text.primary">Gradebook</Typography>
      </Breadcrumbs>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
        <Typography id="gradebook-heading" variant="h4" component="h1">
          Gradebook Overview
        </Typography>
        <Button component={RouterLink} to="/dashboard/assignments" variant="contained" color="primary">
          View Assignments
        </Button>
        <Button component={RouterLink} to="/dashboard" variant="outlined" color="primary">
          Back to Dashboard
        </Button>
      </Stack>
      <Grid container spacing={2} role="list">
        {metrics.map((metric) => (
          <Grid item xs={12} md={4} key={metric.label} role="listitem">
            <Card component="article" elevation={1}>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {metric.label}
                </Typography>
                <Typography variant="h3" component="p" color="primary" gutterBottom>
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metric.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default Gradebook;
