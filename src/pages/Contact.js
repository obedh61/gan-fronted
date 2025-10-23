import React from 'react'
import DrawerAppBar from '../components/Bar'
import ContactComponent from '../components/ContactComponent'
import Footer from '../components/Footer'
import { Box } from '@mui/material';

export const Contact = () => {
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
        <ContactComponent/>
      </Box>

        <Footer/>
    </Box>

  )
}
