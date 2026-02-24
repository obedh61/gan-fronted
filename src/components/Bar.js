import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
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
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuth, signout, getCookie } from '../pages/helpers';
import axios from 'axios';

const drawerWidth = 240;
const navItems = ['Home', 'About', 'Contact'];

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [pendingCount, setPendingCount] = React.useState(0);
  const [myPendingCount, setMyPendingCount] = React.useState(0);
  const navigate = useNavigate();

  const location = useLocation();
  const auth = isAuth();
  const isAdmin = auth && auth.role === 'admin';
  const isLoggedIn = !!auth;
  const isOnAdminPage = location.pathname === '/admin';
  const token = getCookie('token');
  const API = process.env.REACT_APP_API;

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
      <img src={gan} alt="Logo" className="img" width={40} height={40} />
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} component={Link} to={`/${item.toLowerCase()}`}>
              <ListItemText primary={item} />
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
                  <ListItemText primary="Admin Panel" />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/admin/school-years">
                <ListItemIcon sx={{ minWidth: 36 }}><CalendarTodayIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="School Years" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/admin/dashboard">
                <ListItemIcon sx={{ minWidth: 36 }}><DashboardIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/admin/registrations">
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Badge badgeContent={pendingCount} color="error" max={99}>
                    <PeopleIcon fontSize="small" />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Registrations" />
              </ListItemButton>
            </ListItem>
          </>
        )}

        {/* Regular user drawer items */}
        {auth && !isAdmin && (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/register-child">
                <ListItemIcon sx={{ minWidth: 36 }}><PersonAddIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Register Child" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/my-registrations">
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Badge badgeContent={myPendingCount} color="warning" max={99}>
                    <FamilyRestroomIcon fontSize="small" />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="My Registrations" />
              </ListItemButton>
            </ListItem>
          </>
        )}

        <Divider sx={{ my: 1 }} />
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
              <ListItemText primary="Sign Out" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" color="success">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Welcome to Our Kinder
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: '#fff' }} component={Link} to={`/${item.toLowerCase()}`}>
                {item}
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
                    Admin Panel
                  </Button>
                )}
                <Button
                  sx={{ color: '#fff' }}
                  component={Link}
                  to="/admin/school-years"
                  startIcon={<CalendarTodayIcon />}
                >
                  School Years
                </Button>
                <Button
                  sx={{ color: '#fff' }}
                  component={Link}
                  to="/admin/dashboard"
                  startIcon={<DashboardIcon />}
                >
                  Dashboard
                </Button>
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
                  Registrations
                </Button>
              </>
            )}

            {/* Regular user desktop items */}
            {auth && !isAdmin && (
              <>
                <Button
                  sx={{ color: '#fff' }}
                  component={Link}
                  to="/register-child"
                  startIcon={<PersonAddIcon />}
                >
                  Register Child
                </Button>
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
                  My Registrations
                </Button>
              </>
            )}

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
                {"Sign out"}
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
