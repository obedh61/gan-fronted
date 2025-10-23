import DrawerAppBar from '../components/Bar';
import { Box, Container } from '@mui/material';
import Footer from '../components/Footer';
import ScheduleComponent from '../components/ScheduleComponent';

function Services() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Asegura que el contenedor ocupe al menos el 100% de la altura de la ventana
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Box>
          <DrawerAppBar />
        </Box>
                
        <Container >
                    
          <ScheduleComponent/>
          
        </Container>
      </Box>
      
      <Footer/>
    </Box>
    
  );
}

export default Services;