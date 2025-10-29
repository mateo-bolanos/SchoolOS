import PropTypes from 'prop-types';
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/MenuRounded';
import DashboardIcon from '@mui/icons-material/SpaceDashboardRounded';
import ClassIcon from '@mui/icons-material/LibraryBooksRounded';
import GradebookIcon from '@mui/icons-material/TableChartRounded';
import AssignmentIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import MessageIcon from '@mui/icons-material/ForumRounded';
import NotificationsIcon from '@mui/icons-material/NotificationsNoneRounded';
import SearchIcon from '@mui/icons-material/SearchRounded';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import useNavigationStore from '../../stores/navigationStore';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

const drawerWidth = 280;

const srOnly = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0
};

const navigationItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Assignments', icon: <AssignmentIcon />, path: '/assignments' },
  { label: 'Messages', icon: <MessageIcon />, path: '/messages' }
];

const contextualItems = [
  { label: 'Courses', icon: <ClassIcon />, path: '/courses/intro-to-biology' },
  { label: 'Gradebook', icon: <GradebookIcon />, path: '/sections/1/gradebook' }
];

const UserBadge = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2 }}>
    <Avatar alt="Jordan Smith" src="https://i.pravatar.cc/100?img=68" />
    <Box>
      <Typography variant="subtitle1" fontWeight={600}>
        Jordan Smith
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Academic Coordinator
      </Typography>
    </Box>
  </Box>
);

const AppLayout = ({ children }) => {
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const prefersReducedMotion = usePrefersReducedMotion();
  const { isMobileOpen, toggle, close } = useNavigationStore();

  useEffect(() => {
    if (isMobileOpen) {
      close();
    }
  }, [close, isMobileOpen, location.pathname]);

  const activePath = location.pathname;

  const drawerContent = useMemo(
    () => (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Toolbar sx={{ minHeight: 80 }}>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            SchoolOS
          </Typography>
        </Toolbar>
        <Divider />
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <List sx={{ py: 2 }}>
            {navigationItems.map((item) => (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={activePath === item.path}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '& .MuiListItemIcon-root': {
                        color: 'primary.contrastText'
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'text.secondary' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ mx: 2 }} />
          <List
            subheader={
              <ListSubheader component="li" disableSticky sx={{ color: 'text.secondary', typography: 'overline' }}>
                Teaching
              </ListSubheader>
            }
          >
            {contextualItems.map((item) => (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={activePath.startsWith(item.path)}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: 'action.selected',
                      '& .MuiListItemIcon-root': {
                        color: 'primary.main'
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'text.secondary' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <Divider />
        <UserBadge />
      </Box>
    ),
    [activePath]
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          backdropFilter: 'blur(18px)',
          backgroundColor: 'rgba(255,255,255,0.88)'
        }}
      >
        <Toolbar sx={{ minHeight: 80, px: { xs: 2, lg: 4 }, gap: 2 }}>
          {!isDesktop && (
            <IconButton color="primary" edge="start" onClick={toggle} size="large" aria-label="Open navigation">
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'background.paper',
                borderRadius: 3,
                px: 2,
                py: 1,
                border: `1px solid ${theme.palette.divider}`,
                flex: 1,
                maxWidth: 420
              }}
            >
              <SearchIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Search students, courses, or messages
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tooltip title="Notifications">
              <IconButton color="primary" size="large" aria-label="View notifications">
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
            <Avatar alt="Jordan Smith" src="https://i.pravatar.cc/100?img=68" />
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
        <Drawer
          variant={isDesktop ? 'permanent' : 'temporary'}
          open={isDesktop ? true : isMobileOpen}
          onClose={close}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box'
            }
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Toolbar sx={{ minHeight: 80 }} />
        <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography component="h1" sx={srOnly}>
            SchoolOS workspace
          </Typography>
          {prefersReducedMotion ? (
            <Box key={activePath} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {children}
            </Box>
          ) : (
            <Fade in key={activePath} timeout={theme.transitions.duration.shorter}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>{children}</Box>
            </Fade>
          )}
        </Box>
      </Box>
    </Box>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node
};

AppLayout.defaultProps = {
  children: null
};

export default AppLayout;
