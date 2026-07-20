import DrawerAppBar from '../components/Bar';
import { Box, Container, Button, Typography } from '@mui/material';
import { AddWorker } from '../components/AddWorker';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppToastContainer from '../components/AppToastContainer';
import 'react-toastify/dist/ReactToastify.css';

function Workers() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flexGrow: 1 }}>
        <DrawerAppBar />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" color="#4A7B59">
              {t('admin.workers.title')}
            </Typography>
            <Button
              variant="outlined"
              color="success"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/admin')}
            >
              {t('admin.workers.backToAdmin')}
            </Button>
          </Box>
          <AddWorker />
        </Container>
      </Box><AppToastContainer />
    </Box>
  );
}

export default Workers;
