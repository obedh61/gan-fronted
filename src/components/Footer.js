import React from 'react';
import { Box, Button, Container, Grid, Link, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: green[500], // Color "success"
        color: 'white',
        position: 'relative',
        bottom: 0,
        width: '100%',
        padding: '20px 0',
        mt: 'auto',
        marginTop: {
            xs: '20px',   // 20px en pantallas pequeñas
            sm: '40px',   // 40px en pantallas medianas y grandes
          },
      }}
    >
      <Container>
        <Grid container spacing={2} justifyContent="center">
          {/* Sección de About */}
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography variant="h6">About</Typography>
            <Button component={RouterLink} to={'/about'} color="inherit" underline="hover">
              About Us
            </Button>
          </Grid>

          {/* Sección de Home */}
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography variant="h6">Home</Typography>
            <Button component={RouterLink} to={'/home'} color="inherit" underline="hover">
              Home Page
            </Button>
          </Grid>

          {/* Sección de Contact */}
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography variant="h6">Contact</Typography>
            <Button component={RouterLink} to={'/contact'} color="inherit" underline="hover">
              Contact Us
            </Button>
          </Grid>
        </Grid>
      </Container>

      <Box
        sx={{
          mt: 2,
          textAlign: 'center',
          fontSize: '0.875rem',
        }}
      >
        <Typography variant="body2">&copy; 2024 Gan Second Home</Typography>
      </Box>
    </Box>
  );
};

export default Footer;
