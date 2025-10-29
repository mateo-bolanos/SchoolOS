import PropTypes from 'prop-types';
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';

const AppLayout = ({ title = 'SchoolOS', children = null }) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Stack component="nav" direction="row" spacing={1} aria-label="Primary">
            <Button component={RouterLink} to="/" color="inherit">
              Dashboard
            </Button>
            <Button component={RouterLink} to="/dashboard/gradebook" color="inherit">
              Gradebook
            </Button>
            <Button component={RouterLink} to="/dashboard/assignments" color="inherit">
              Assignments
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container
        component="main"
        id="main-content"
        maxWidth="lg"
        role="main"
        sx={{ py: 4 }}
      >
        {children ?? <Outlet />}
      </Container>
    </Box>
  );
};

AppLayout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
};

export default AppLayout;
