import React from 'react';
import { Box, Button, Container, Grid, Typography, IconButton, Stack, Divider } from '@mui/material';
import { green } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const socialLinks = [
    { icon: <EmailIcon />, label: t('footer.email'), href: 'mailto:gansecondhome@gmail.com' },
    { icon: <WhatsAppIcon />, label: t('footer.whatsapp'), href: 'https://wa.me/9720527082519' },
    { icon: <FacebookIcon />, label: t('footer.facebook'), href: 'https://www.facebook.com/sarahpicovsky?mibextid=ZbWKwL' },
    { icon: <InstagramIcon />, label: t('footer.instagram'), href: 'https://www.instagram.com/gansecondhome?igsh=NmQ2cGlzNHd5Zmti' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: isDark ? '#1b3a26' : green[500],
        color: 'white',
        width: '100%',
        py: 4,
        mt: 6,
      }}
    >
      <Container>
        <Grid container spacing={4} justifyContent="center">
          {/* Brand */}
          <Grid item xs={12} md={4} textAlign={{ xs: 'center', md: 'left' }}>
            <Typography
              variant="h6"
              gutterBottom
              noWrap
              sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
            >
              {t('home.menuTitle')}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, maxWidth: 320, mx: { xs: 'auto', md: 0 } }}>
              {t('footer.description')}
            </Typography>
          </Grid>

          {/* Quick links */}
          <Grid item xs={12} sm={6} md={2} textAlign="center">
            <Typography variant="h6" gutterBottom>
              {t('footer.linksTitle')}
            </Typography>
            <Stack spacing={1} alignItems="center">
              {!isActive('/home') && (
                <Button component={RouterLink} to="/home" color="inherit" size="small">
                  {t('footer.homePage')}
                </Button>
              )}
              {!isActive('/about') && (
                <Button component={RouterLink} to="/about" color="inherit" size="small">
                  {t('footer.aboutUs')}
                </Button>
              )}
              {!isActive('/contact') && (
                <Button component={RouterLink} to="/contact" color="inherit" size="small">
                  {t('footer.contactUs')}
                </Button>
              )}
            </Stack>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={3} textAlign="center">
            <Typography variant="h6" gutterBottom>
              {t('footer.contactTitle')}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center">
              {socialLinks.map((link) => (
                <IconButton
                  key={link.label}
                  component="a"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
                >
                  {link.icon}
                </IconButton>
              ))}
            </Stack>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              gansecondhome@gmail.com
            </Typography>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} md={3} textAlign={{ xs: 'center', md: 'right' }}>
            <Typography variant="h6" gutterBottom>
              {t('footer.legalTitle')}
            </Typography>
            <Stack spacing={1} alignItems={{ xs: 'center', md: 'flex-end' }}>
              <Button component={RouterLink} to="/privacy" color="inherit" size="small">
                {t('footer.privacyPolicy')}
              </Button>
              <Button component={RouterLink} to="/terms" color="inherit" size="small">
                {t('footer.termsOfService')}
              </Button>
              <Button component={RouterLink} to="/accessibility" color="inherit" size="small">
                {t('footer.accessibility')}
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.3)' }} />

        <Box textAlign="center">
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
