import React from 'react';
import { Box, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import logo from '../assets/logo.svg'

const ContactMain = () => {
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
    <Box position="relative" sx={{ padding: 3, textAlign: 'center', fontFamily: 'Arial, sans-serif', marginTop: 4, }}>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
        //   marginTop: 1,
        }}
      >
        {/* Facebook */}
        <IconButton
          onClick={handleFacebookClick}
          sx={{
            backgroundColor: '#1877F2',
            color: 'white',
            width: 25,
            height: 25,
            transition: 'transform 0.2s, background-color 0.2s',
            '&:hover': {
              backgroundColor: '#145dbf',
              transform: 'scale(1.1)',
            },
          }}
        >
          <FacebookIcon sx={{ fontSize: 15 }} />
        </IconButton>

        {/* Instagram */}
        <IconButton
          onClick={handleInstagramClick}
          sx={{
            background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
            color: 'white',
            width: 25,
            height: 25,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.1)',
              opacity: 0.9,
            },
          }}
        >
          <InstagramIcon sx={{ fontSize: 15 }} />
        </IconButton>

        {/* Email */}
        <IconButton
          onClick={handleEmailClick}
          sx={{
            backgroundColor: '#D44638',
            color: 'white',
            width: 25,
            height: 25,
            transition: 'transform 0.2s, background-color 0.2s',
            '&:hover': {
              backgroundColor: '#b0352b',
              transform: 'scale(1.1)',
            },
          }}
        >
          <EmailIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>
      <Box
        component="img"
        src={logo}
        alt="login icon"
        sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 210,
            opacity: 0.2, // hace que se vea como fondo
            zIndex: 1,
            pointerEvents: "none",
        }}
        />
    </Box>
  );
};

export default ContactMain;
