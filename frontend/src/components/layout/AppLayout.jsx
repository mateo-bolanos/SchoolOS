import PropTypes from 'prop-types';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

const AppLayout = ({ title = 'SchoolOS', children = null }) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
