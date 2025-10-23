import React from 'react'
import DrawerAppBar from '../components/Bar'
import { Box } from '@mui/material';
import Footer from '../components/Footer'
import BlogAbut from '../components/BlogAbout';

export const About = () => {
  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh', // Asegura que el contenedor ocupe al menos el 100% de la altura de la ventana
    }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <DrawerAppBar/>
        {/* <BlogPost/> */}
        <BlogAbut />
      </Box>

        <Footer/>
    </Box>
  )
}
