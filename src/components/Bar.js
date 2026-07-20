import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import gan from '../assets/FB_IMG_1701110493696.jpg';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Tooltip from '@mui/material/Tooltip';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuth, signout, getCookie } from '../pages/helpers';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { useColorMode } from '../ColorModeContext';

const drawerWidth = 240;
const navItems = [
  { key: 'nav.home', path: '/home' },
  { key: 'nav.about', path: '/about' },
  { key: 'nav.contact', path: '/contact' },
];

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [pendingCount, setPendingCount] = React.useState(0);
  const [myPendingCount, setMyPendingCount] = React.useState(0);
  const navigate = useNavigate();

  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const auth = isAuth();
  const isAdmin = auth && auth.role === 'admin';
  const isLoggedIn = !!auth;
  const isOnAdminPage = isActive('/admin');
  const token = getCookie('token');
  const API = process.env.REACT_APP_API;
  const { t } = useTranslation();
  const { mode, toggleColorMode } = useColorMode();
  const colorModeToggle = (
    <Tooltip title={mode === 'dark' ? t('common.lightMode') : t('common.darkMode')}>
      <IconButton
        color="inherit"
        aria-label={mode === 'dark' ? t('common.lightMode') : t('common.darkMode')}
        onClick={toggleColorMode}
      >
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );

  React.useEffect(() => {
    if (!token || !API) return;
    const headers = { Authorization: `Bearer ${token}` };

    const fetchBadgeCounts = () => {
      if (isAdmin) {
        axios.get(`${API}/registration/pending`, { headers })
          .then(res => {
            const data = res.data.data || [];
            setPendingCount(data.length);
          })
          .catch(() => {});
      }

      if (isLoggedIn) {
        axios.get(`${API}/registration/my-registrations`, { headers })
          .then(res => {
            const data = res.data.data || [];
            setMyPendingCount(data.filter(r => r.status === 'pending').length);
          })
          .catch(() => {});
      }
    };

    fetchBadgeCounts();
    const interval = setInterval(fetchBadgeCounts, 60000);
    return () => clearInterval(interval);
  }, [token, API, isAdmin, isLoggedIn]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <img src={gan} alt={t('accessibility.logoAlt')} className="img" width={40} height={40} />
      <Divider />
      <List>
        {navItems
          .filter((item) => !isActive(item.path))
          .map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }} component={Link} to={item.path}>
                <ListItemText primary={t(item.key)} />
              </ListItemButton>
            </ListItem>
          ))}

        {/* Admin drawer items */}
        {isAdmin && (
          <>
            <Divider sx={{ my: 1 }} />
            {!isOnAdminPage && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/admin">
                  <ListItemIcon sx={{ minWidth: 36 }}><AdminPanelSettingsIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary={t('nav.adminPanel')} />
                </ListItemButton>
              </ListItem>
            )}
            {!isActive('/admin/school-years') && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/admin/school-years">
                  <ListItemIcon sx={{ minWidth: 36 }}><CalendarTodayIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary={t('nav.schoolYears')} />
                </ListItemButton>
              </ListItem>
            )}
            {!isActive('/admin/dashboard') && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/admin/dashboard">
                  <ListItemIcon sx={{ minWidth: 36 }}><DashboardIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary={t('nav.dashboard')} />
                </ListItemButton>
              </ListItem>
            )}
            {!isActive('/admin/registrations') && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/admin/registrations">
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Badge badgeContent={pendingCount} color="error" max={99}>
                      <PeopleIcon fontSize="small" />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary={t('nav.registrations')} />
                </ListItemButton>
              </ListItem>
            )}
          </>
        )}

        {/* Regular user drawer items */}
        {auth && !isAdmin && (
          <>
            <Divider sx={{ my: 1 }} />
            {!isActive('/register-child') && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/register-child">
                  <ListItemIcon sx={{ minWidth: 36 }}><PersonAddIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary={t('nav.registerChild')} />
                </ListItemButton>
              </ListItem>
            )}
            {!isActive('/my-registrations') && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/my-registrations">
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Badge badgeContent={myPendingCount} color="warning" max={99}>
                      <FamilyRestroomIcon fontSize="small" />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary={t('nav.myRegistrations')} />
                </ListItemButton>
              </ListItem>
            )}
          </>
        )}

        <Divider sx={{ my: 1 }} />
        <ListItem component="div" onClick={(e) => e.stopPropagation()} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            {t('language')}
          </Typography>
          <LanguageSwitcher variant="light" fullWidth />
        </ListItem>
        {auth && (
          <ListItem key="sign out" disablePadding>
            <ListItemButton
              sx={{ textAlign: 'center' }}
              component={Button}
              color="error"
              variant="contained"
              endIcon={<ExitToAppIcon />}
              onClick={() => {
                signout(() => {
                  navigate('/home');
                });
              }}
            >
              <ListItemText primary={t('common.signOut')} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav" color="success">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label={t('common.openDrawer')}
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, marginInlineStart: 'auto', alignItems: 'center' }}>
            <LanguageSwitcher />
            {colorModeToggle}
            {auth && (
              <IconButton
                color="inherit"
                aria-label={t('common.signOut')}
                onClick={() => {
                  signout(() => {
                    navigate('/home');
                  });
                }}
              >
                <ExitToAppIcon />
              </IconButton>
            )}
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            {t('nav.welcome')}
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems
              .filter((item) => !isActive(item.path))
              .map((item) => (
                <Button key={item.key} sx={{ color: '#fff' }} component={Link} to={item.path}>
                  {t(item.key)}
                </Button>
              ))}

            {/* Admin desktop items */}
            {isAdmin && (
              <>
                {!isOnAdminPage && (
                  <Button
                    sx={{ color: '#fff' }}
                    component={Link}
                    to="/admin"
                    startIcon={<AdminPanelSettingsIcon />}
                  >
                    {t('nav.adminPanel')}
                  </Button>
                )}
                {!isActive('/admin/school-years') && (
                  <Button
                    sx={{ color: '#fff' }}
                    component={Link}
                    to="/admin/school-years"
                    startIcon={<CalendarTodayIcon />}
                  >
                    {t('nav.schoolYears')}
                  </Button>
                )}
                {!isActive('/admin/dashboard') && (
                  <Button
                    sx={{ color: '#fff' }}
                    component={Link}
                    to="/admin/dashboard"
                    startIcon={<DashboardIcon />}
                  >
                    {t('nav.dashboard')}
                  </Button>
                )}
                {!isActive('/admin/registrations') && (
                  <Button
                    sx={{ color: '#fff' }}
                    component={Link}
                    to="/admin/registrations"
                    startIcon={
                      <Badge badgeContent={pendingCount} color="error" max={99}>
                        <PeopleIcon />
                      </Badge>
                    }
                  >
                    {t('nav.registrations')}
                  </Button>
                )}
              </>
            )}

            {/* Regular user desktop items */}
            {auth && !isAdmin && (
              <>
                {!isActive('/register-child') && (
                  <Button
                    sx={{ color: '#fff' }}
                    component={Link}
                    to="/register-child"
                    startIcon={<PersonAddIcon />}
                  >
                    {t('nav.registerChild')}
                  </Button>
                )}
                {!isActive('/my-registrations') && (
                  <Button
                    sx={{ color: '#fff' }}
                    component={Link}
                    to="/my-registrations"
                    startIcon={
                      <Badge badgeContent={myPendingCount} color="warning" max={99}>
                        <FamilyRestroomIcon />
                      </Badge>
                    }
                  >
                    {t('nav.myRegistrations')}
                  </Button>
                )}
              </>
            )}

            <LanguageSwitcher />
            {colorModeToggle}
            {auth && (
              <Button
                key="sign out"
                sx={{ color: '#fff', ml: 1 }}
                component={Button}
                color="error"
                variant="contained"
                endIcon={<ExitToAppIcon />}
                onClick={() => {
                  signout(() => {
                    navigate('/home');
                  });
                }}
              >
                {t('common.signOut')}
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Mejor rendimiento al abrir en móviles.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      {/* Contenedor principal con margen superior */}
      <Box
        sx={{
          flexGrow: 1,
          paddingTop: '80px', // Ajuste para el espacio entre AppBar y contenido
          paddingX: 2, // Agregar algo de margen lateral
        }}
      >
        {/* Aquí puedes incluir el contenido principal de la página */}
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;
