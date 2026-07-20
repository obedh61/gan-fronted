import React from 'react'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import {
    Grid,
    IconButton,
    Typography,
    Stack,
  } from "@mui/material";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WebIcon from '@mui/icons-material/Web';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { isAuth } from '../pages/helpers';

function MenuApp() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const auth = isAuth();
  const registerTo = auth
    ? (auth.role === 'admin' ? '/admin' : '/my-registrations')
    : '/access';

  const items = [
    {
      icon: <AppRegistrationIcon sx={{ fontSize: { xs: 26, md: 34 } }} />,
      label: t('common.register'),
      to: registerTo,
      isLink: true,
      color: '#E08E79',
      shadow: 'rgba(224,142,121,0.35)',
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: { xs: 26, md: 34 } }} />,
      label: t('common.startDay'),
      to: '/timer',
      isLink: true,
      color: '#7FBFB5',
      shadow: 'rgba(127,191,181,0.35)',
    },
    {
      icon: <WhatsAppIcon sx={{ fontSize: { xs: 26, md: 34 } }} />,
      label: t('common.contact'),
      href: 'https://wa.me/9720527082519',
      isLink: false,
      color: '#8FBC8F',
      shadow: 'rgba(143,188,143,0.35)',
    },
    {
      icon: <WebIcon sx={{ fontSize: { xs: 26, md: 34 } }} />,
      label: t('common.blog'),
      to: '/blogs',
      isLink: true,
      color: '#E6C678',
      shadow: 'rgba(230,198,120,0.35)',
    },
  ];

  return (
    <Grid item xs={12}>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, md: 3 },
          position: 'relative',
          borderRadius: 5,
          overflow: 'hidden',
          background: isDark
            ? 'linear-gradient(135deg, #1d2a20 0%, #15211a 100%)'
            : 'linear-gradient(135deg, #fffdf7 0%, #f0f9f4 100%)',
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          noWrap
          sx={{
            textAlign: 'center',
            fontWeight: 800,
            color: isDark ? '#e8f0e9' : '#2e4a35',
            mb: 3,
            position: 'relative',
            zIndex: 2,
            letterSpacing: '0.5px',
            fontSize: { xs: '1.1rem', md: '1.5rem' },
          }}
        >
          {t('home.menuTitle')}
        </Typography>

        <Grid container spacing={2} sx={{ position: 'relative', zIndex: 2 }}>
          {items.map((item, index) => (
            <Grid item xs={6} key={index}>
              <Paper
                elevation={3}
                component={item.isLink ? Link : 'a'}
                {...(item.isLink
                  ? { to: item.to }
                  : { href: item.href, target: '_blank', rel: 'noopener noreferrer' })}
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  textDecoration: 'none',
                  p: { xs: 1.25, md: 2.5 },
                  borderRadius: { xs: '18px', md: '24px' },
                  bgcolor: isDark ? '#223324' : '#fff',
                  border: { xs: '1px solid', md: '2px solid' },
                  borderColor: item.color,
                  boxShadow: { xs: `0 5px 0 ${item.color}, 0 8px 14px ${item.shadow}`, md: `0 8px 0 ${item.color}, 0 14px 20px ${item.shadow}` },
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: { xs: 'translateY(-4px) scale(1.02)', md: 'translateY(-6px) scale(1.02)' },
                    boxShadow: { xs: `0 8px 0 ${item.color}, 0 12px 18px ${item.shadow}`, md: `0 12px 0 ${item.color}, 0 20px 28px ${item.shadow}` },
                  },
                  '&:active': {
                    transform: 'translateY(4px)',
                    boxShadow: `0 2px 0 ${item.color}, 0 6px 10px ${item.shadow}`,
                  },
                }}
              >
                <Stack direction="column" alignItems="center" spacing={{ xs: 1, md: 1.5 }}>
                  <IconButton
                    sx={{
                      color: '#fff',
                      bgcolor: item.color,
                      width: { xs: 44, md: 56 },
                      height: { xs: 44, md: 56 },
                      pointerEvents: 'none',
                    }}
                  >
                    {item.icon}
                  </IconButton>
                  <Box
                    sx={{
                      borderRadius: '16px',
                      px: { xs: 1.5, md: 2.5 },
                      py: { xs: 0.75, md: 1 },
                      bgcolor: item.color,
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: { xs: '0.8rem', md: '0.95rem' },
                      textAlign: 'center',
                    }}
                  >
                    {item.label}
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box
          component="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          sx={{
            position: 'absolute',
            bottom: -12,
            left: 0,
            width: '100%',
            height: 'auto',
            zIndex: 1,
            opacity: 0.18,
            transformOrigin: 'bottom',
            transform: { xs: 'scaleY(1.9)', md: 'scaleY(1.35)' },
          }}
        >
          <path
            fill="#7FA88B"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            style={{
              animation: 'waveVertical 2.5s ease-in-out infinite alternate',
            }}
          />
        </Box>

        <style>
          {`
            @keyframes waveVertical {
              0% {
                transform: translateY(-12px);
              }
              100% {
                transform: translateY(0);
              }
            }
          `}
        </style>
      </Paper>
    </Grid>
  )
}

export default MenuApp;
