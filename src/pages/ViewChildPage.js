import DrawerAppBar from '../components/Bar';
import { Box, Container, Button } from '@mui/material';
import Footer from '../components/Footer';
import { ViewChildren } from '../components/ViewChildren';
import { useNavigate } from 'react-router-dom';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';

function ViewChildPage() {
  const navigate = useNavigate()
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

        </Container>
        <ViewChildren />
        <Button
          key="sign out"
          sx={{ color: '#fff', margin: 2 }}
          component={Button}
          color="secondary"
          variant="contained"
          endIcon={<DashboardCustomizeIcon />}
          onClick={() => {
            navigate('/admin');
          }}
        >
          {"Dasboard"}
        </Button>
      </Box>
      
      <Footer/>
    </Box>
    
  );
}

export default ViewChildPage;