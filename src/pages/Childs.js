import DrawerAppBar from '../components/Bar';
import { Box, Container, Button } from '@mui/material';
import { AddNewChild } from '../components/AddNewChild';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';

function Childs() {
  const navigate = useNavigate()
  const { t } = useTranslation()
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
          maxWidth={400}
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
          <AddNewChild />
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
            {t('common.dashboard')}
          </Button>
        </Box>

        </Container>
      </Box></Box>
    
  );
}

export default Childs;
