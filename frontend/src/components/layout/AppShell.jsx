import PropTypes from 'prop-types';
import { Fragment, useEffect, useMemo } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';
import {
  DashboardOutlined,
  Menu as MenuIcon,
  AssignmentOutlined,
  ChatBubbleOutline
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { NavLink, useLocation } from 'react-router-dom';
import useUiPreferences from '../../store/uiPreferences';

const drawerWidth = 264;

const navItems = [
  {
    label: 'Dashboard',
    icon: <DashboardOutlined fontSize="small" />,
    path: '/dashboard'
  },
  {
    label: 'Assignments',
    icon: <AssignmentOutlined fontSize="small" />,
    path: '/assignments'
  },
  {
    label: 'Messages',
    icon: <ChatBubbleOutline fontSize="small" />,
    path: '/messages'
  }
];

const AppShell = ({ children }) => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const { isSidebarOpen, toggleSidebar, setSidebar } = useUiPreferences();

  useEffect(() => {
    setSidebar(isDesktop);
  }, [isDesktop, setSidebar]);

  const transition = reduceMotion
    ? 'none'
    : theme.transitions.create(['margin', 'width'], {
        duration: theme.transitions.duration.short,
        easing: theme.transitions.easing.easeOut
      });

  const renderNavItems = useMemo(
    () =>
      navItems.map((item) => {
        const isActive = pathname.startsWith(item.path);
        return (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            selected={isActive}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              transition,
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                color: theme.palette.primary.main,
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        );
      }),
    [pathname, transition, theme.palette.action.selected, theme.palette.primary.main]
  );

  const drawerContent = (
    <Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 3 }}>
        <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 40, height: 40 }}>S</Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            SchoolOS
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Scholar Console
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ letterSpacing: theme.typography.caption?.letterSpacing ?? '0.08em' }}
        >
          Navigation
        </Typography>
        <List component="nav" sx={{ mt: 1 }}>
          {renderNavItems}
        </List>
      </Box>
    </Fragment>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        color="default"
        elevation={1}
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          transition,
          width: { lg: `calc(100% - ${isDesktop && isSidebarOpen ? drawerWidth : 0}px)` },
          ml: { lg: isDesktop && isSidebarOpen ? `${drawerWidth}px` : 0 }
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isDesktop && (
              <IconButton
                color="primary"
                edge="start"
                onClick={toggleSidebar}
                aria-label="Toggle navigation"
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box>
              <Typography variant="h6">Welcome back</Typography>
              <Typography variant="body2" color="text.secondary">
                Stay on top of your classes today.
              </Typography>
            </Box>
          </Box>
          <Tooltip title="Faculty Advisor">
            <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>FA</Avatar>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
        aria-label="Main navigation"
      >
        <Drawer
          variant={isDesktop ? 'persistent' : 'temporary'}
          open={isSidebarOpen}
          onClose={() => setSidebar(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
              boxSizing: 'border-box',
              transition
            }
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          pt: { xs: 10, md: 12 },
          width: '100%',
          transition,
          ml: { lg: isSidebarOpen && isDesktop ? `${drawerWidth}px` : 0 }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

AppShell.propTypes = {
  children: PropTypes.node
};

export default AppShell;
