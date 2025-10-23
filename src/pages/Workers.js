import DrawerAppBar from '../components/Bar';
import { Box, Container, Button } from '@mui/material';
import Footer from '../components/Footer';
import { AddWorker } from '../components/AddWorker';
import { useNavigate } from 'react-router-dom';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';



function Workers() {
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
          
        <Box 
          display="flex"
          flexDirection={"column"}
          maxWidth={600}
          alignItems={"center"}
          justifyContent={"center"}
          margin={"auto"}
          
          padding={3}
          borderRadius={5}
          boxShadow={"5px 5px 10px #ccc"}
          sx={{
            ":hover": {
              boxShadow: "10px 10px 20px #ccc"
            }
          }}
        >
          <AddWorker />
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
        </Container>
      </Box>
      
      <Footer/>
    </Box>
    
  );
}

export default Workers;