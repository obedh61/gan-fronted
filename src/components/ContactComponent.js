import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import { useTranslation } from 'react-i18next';

const ContactComponent = () => {
  const { t } = useTranslation();

  const handleFacebookClick = () => {
    window.open('https://www.facebook.com/sarahpicovsky?mibextid=ZbWKwL', '_blank');
  };

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/gansecondhome?igsh=NmQ2cGlzNHd5Zmti', '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:gansecondhome@gmail.com';
  };

  return (
    <Box sx={{ padding: 4, textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <Typography variant="h4" gutterBottom>
        {t('home.contactTitle')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 3,
          marginTop: 2,
        }}
      >
        {/* Facebook */}
        <IconButton
          onClick={handleFacebookClick}
          sx={{
            backgroundColor: '#1877F2',
            color: 'white',
            width: 70,
            height: 70,
            transition: 'transform 0.2s, background-color 0.2s',
            '&:hover': {
              backgroundColor: '#145dbf',
              transform: 'scale(1.1)',
            },
          }}
        >
          <FacebookIcon sx={{ fontSize: 36 }} />
        </IconButton>

        {/* Instagram */}
        <IconButton
          onClick={handleInstagramClick}
          sx={{
            background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
            color: 'white',
            width: 70,
            height: 70,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.1)',
              opacity: 0.9,
            },
          }}
        >
          <InstagramIcon sx={{ fontSize: 36 }} />
        </IconButton>

        {/* Email */}
        <IconButton
          onClick={handleEmailClick}
          sx={{
            backgroundColor: '#D44638',
            color: 'white',
            width: 70,
            height: 70,
            transition: 'transform 0.2s, background-color 0.2s',
            '&:hover': {
              backgroundColor: '#b0352b',
              transform: 'scale(1.1)',
            },
          }}
        >
          <EmailIcon sx={{ fontSize: 36 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ContactComponent;
