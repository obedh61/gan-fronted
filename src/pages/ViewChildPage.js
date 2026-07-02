import DrawerAppBar from '../components/Bar';
import { Box, Container, Button } from '@mui/material';
import { ViewChildren } from '../components/ViewChildren';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';

function ViewChildPage() {
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
          {t('common.dashboard')}
        </Button>
      </Box></Box>
    
  );
}

export default ViewChildPage;
