import { Fragment } from 'react';
import { Breadcrumbs, Button, Card, CardContent, Divider, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';

const assignments = [
  {
    title: 'Essay: The Renaissance Impact',
    due: 'Due in 2 days',
    status: '12 of 18 submissions received'
  },
  {
    title: 'Algebra II: Quadratic Functions',
    due: 'Due tomorrow',
    status: 'Grading in progress for 6 submissions'
  },
  {
    title: 'Biology Lab Report',
    due: 'Due next week',
    status: 'Rubric published; awaiting submissions'
  }
];

const Assignments = () => {
  return (
    <Stack component="section" spacing={3} aria-labelledby="assignments-heading">
      <Breadcrumbs aria-label="Breadcrumb">
        <Link component={RouterLink} color="inherit" to="/dashboard">
          Dashboard
        </Link>
        <Link component={RouterLink} color="inherit" to="/dashboard/gradebook">
          Gradebook
        </Link>
        <Typography color="text.primary">Assignments</Typography>
      </Breadcrumbs>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
        <Typography id="assignments-heading" variant="h4" component="h1">
          Assignments
        </Typography>
        <Button component={RouterLink} to="/dashboard/gradebook" variant="outlined" color="primary">
          Back to Gradebook
        </Button>
      </Stack>
      <Card component="article" elevation={1}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Upcoming & Active Assignments
          </Typography>
          <List disablePadding>
            {assignments.map((assignment, index) => (
              <Fragment key={assignment.title}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" component="span">
                        {assignment.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.secondary">
                          {assignment.due}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          {assignment.status}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < assignments.length - 1 && <Divider component="li" />}
              </Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default Assignments;
