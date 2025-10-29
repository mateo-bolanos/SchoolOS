import PropTypes from 'prop-types';
import {
  AppBar,
  Avatar,
  Box,
  Container,
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
import { useTheme } from '@mui/material/styles';
import {
  AssignmentOutlined,
  DashboardOutlined,
  GradeOutlined,
  MailOutline,
  Menu as MenuIcon,
  MenuBookOutlined
} from '@mui/icons-material';
import { Fragment, useEffect } from 'react';
import { Link as RouterLink, useLocation, Outlet } from 'react-router-dom';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';
import useUiStore from '../../store/uiStore';
import ToastViewport from '../feedback/ToastViewport';

const drawerWidth = 280;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: DashboardOutlined, path: '/dashboard', match: ['/dashboard'] },
  { label: 'Courses', icon: MenuBookOutlined, path: '/courses/academy-101', match: ['/courses'] },
  { label: 'Gradebook', icon: GradeOutlined, path: '/sections/academy-101-a/gradebook', match: ['/sections'] },
  { label: 'Assignments', icon: AssignmentOutlined, path: '/assignments', match: ['/assignments'] },
  { label: 'Messages', icon: MailOutline, path: '/messages', match: ['/messages'] }
];

const AppShell = ({ children }) => {
  const location = useLocation();
  const theme = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const { mobileNavOpen, setMobileNavOpen, toggleMobileNav } = useUiStore((state) => ({
    mobileNavOpen: state.mobileNavOpen,
    setMobileNavOpen: state.setMobileNavOpen,
    toggleMobileNav: state.toggleMobileNav
  }));

  useEffect(() => {
    if (mobileNavOpen) {
      setMobileNavOpen(false);
    }
  }, [location.pathname, mobileNavOpen, setMobileNavOpen]);

  const transitionDuration = prefersReducedMotion ? 0 : theme.transitions.duration.standard;
  const navItemTransition = prefersReducedMotion
    ? 'none'
    : theme.transitions.create(['background-color', 'transform'], {
        duration: theme.transitions.duration.shorter,
        easing: theme.transitions.easing.standard
      });

  const navigation = (
    <Box display="flex" flexDirection="column" height="100%">
      <Box px={3} py={3} display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }} variant="rounded">
          SO
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
            SchoolOS
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Scholar Portal
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box flexGrow={1} px={2} py={2}>
        <List sx={{ display: 'grid', gap: 0.5 }}>
          {NAV_ITEMS.map(({ label, icon: Icon, path, match }) => {
            const isActive = match?.some((segment) => location.pathname.startsWith(segment));

            return (
              <ListItemButton
                key={path}
                component={RouterLink}
                to={path}
                selected={isActive}
                onClick={() => {
                  if (!isDesktop) {
                    toggleMobileNav();
                  }
                }}
                sx={{
                  borderRadius: 2,
                  transition: navItemTransition,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'inherit'
                    }
                  },
                  '&:hover': {
                    transform: prefersReducedMotion ? 'none' : 'translateX(4px)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
      <Divider />
      <Box px={3} py={3} display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>MS</Avatar>
        <Box>
          <Typography variant="subtitle1">Matteo Scholar</Typography>
          <Typography variant="body2" color="text.secondary">
            Administrator
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Fragment>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar
          position="fixed"
          color="default"
          elevation={0}
          sx={{
            width: { lg: `calc(100% - ${drawerWidth}px)` },
            ml: { lg: `${drawerWidth}px` },
            borderBottom: `1px solid ${theme.palette.divider}`,
            backdropFilter: 'blur(14px)',
            backgroundColor: 'rgba(255,255,255,0.9)'
          }}
        >
          <Toolbar sx={{ display: 'flex', gap: 2 }}>
            {!isDesktop && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={toggleMobileNav}
                aria-label="Toggle navigation menu"
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box flexGrow={1}>
              <Typography component="p" variant="h5" fontWeight={600} color="text.primary">
                {NAV_ITEMS.find((item) => item.match?.some((segment) => location.pathname.startsWith(segment)))?.label ?? 'Dashboard'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Empower educators with timely insights.
              </Typography>
            </Box>
            <Tooltip title="Notifications coming soon">
              <IconButton color="primary">
                <MailOutline />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
          aria-label="Primary navigation"
        >
          <Drawer
            variant={isDesktop ? 'permanent' : 'temporary'}
            open={isDesktop ? true : mobileNavOpen}
            onClose={toggleMobileNav}
            ModalProps={{ keepMounted: true }}
            transitionDuration={transitionDuration}
            sx={{
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                borderRight: `1px solid ${theme.palette.divider}`,
                backgroundColor: 'background.paper'
              }
            }}
          >
            {navigation}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { lg: `calc(100% - ${drawerWidth}px)` },
            bgcolor: 'background.default',
            minHeight: '100vh'
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ py: 4 }}>
            {children ?? <Outlet />}
          </Container>
        </Box>
      </Box>
      <ToastViewport />
    </Fragment>
  );
};

AppShell.propTypes = {
  children: PropTypes.node
};

export default AppShell;
