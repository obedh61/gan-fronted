import React from 'react'
import DrawerAppBar from '../components/Bar'
import BlogPost from '../components/BlogPost'
import { Box } from '@mui/material';
import Footer from '../components/Footer'

export const Method = () => {
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
        <BlogPost/>
        {/* <BlogAbut /> */}
      </Box>

        <Footer/>
    </Box>
  )
}
