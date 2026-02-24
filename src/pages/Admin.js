import React from 'react'
import DrawerAppBar from '../components/Bar'
import DashboardAdmin from '../components/Dashboard'
import { Box, Container, Grid } from '@mui/material'
import Footer from '../components/Footer'

export const Admin = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flexGrow: 1 }}>
        <DrawerAppBar />
        <Container sx={{ py: 2 }}>
          <Grid container spacing={2}>
            <DashboardAdmin />
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  )
}
