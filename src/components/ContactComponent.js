import React from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import { Facebook, Instagram, Mail } from '@mui/icons-material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';

const ContactComponent = () => {
  const handleFacebookClick = () => {
    window.open('https://www.facebook.com/sarahpicovsky?mibextid=ZbWKwL', '_blank'); // Reemplaza con tu URL de Facebook
  };

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/gansecondhome?igsh=NmQ2cGlzNHd5Zmti', '_blank'); // Reemplaza con tu URL de Instagram
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:gansecondhome@gmail.com'; // Reemplaza con tu correo electrónico
  };

  return (
    <Box sx={{ padding: 4, fontFamily: 'Arial, sans-serif' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Contact Us
      </Typography>
      <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
        <Grid item xs={12} md="auto">
          <Button
            variant="contained"
            color="primary"
            startIcon={<FacebookIcon />}
            onClick={handleFacebookClick}
            sx={{ padding: '12px 24px' }}
          >
            Facebook
          </Button>
        </Grid>
        <Grid item xs={12} md="auto">
          <Button
            variant="contained"
            color="secondary"
            startIcon={<InstagramIcon />}
            onClick={handleInstagramClick}
            sx={{ padding: '12px 24px' }}
          >
            Instagram
          </Button>
        </Grid>
        <Grid item xs={12} md="auto">
          <Button
            variant="contained"
            color="error"
            startIcon={<EmailIcon />}
            onClick={handleEmailClick}
            sx={{ padding: '12px 24px' }}
          >
            Email
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactComponent;
