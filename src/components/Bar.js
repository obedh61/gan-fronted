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
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import gan from '../assets/FB_IMG_1701110493696.jpg';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link, useNavigate } from 'react-router-dom';
import { isAuth, signout } from '../pages/helpers';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';

const drawerWidth = 240;
const navItems = ['Home', 'About', 'Contact'];

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();

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
        {isAuth() && (
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
            {isAuth() && (
              <Button
                key="sign out"
                sx={{ color: '#fff' }}
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
            {/* {isAuth().role == 'admin' && (
              <Button
                key="sign out"
                sx={{ color: '#fff', margin: 2 }}
                component={Button}
                color="secondary"
                variant="contained"
                endIcon={<DashboardCustomizeIcon />}
                onClick={() => {
                  navigate('/admin');
                }}
              >
                {"Dasboard"}
              </Button>
            )} */}
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
