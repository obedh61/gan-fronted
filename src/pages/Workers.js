import DrawerAppBar from '../components/Bar';
import { Box, Container, Button, Typography } from '@mui/material';
import Footer from '../components/Footer';
import { AddWorker } from '../components/AddWorker';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Workers() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flexGrow: 1 }}>
        <DrawerAppBar />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" color="#4A7B59">
              Manage Workers
            </Typography>
            <Button
              variant="outlined"
              color="success"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/admin')}
            >
              Admin Panel
            </Button>
          </Box>
          <AddWorker />
        </Container>
      </Box>
      <Footer />
      <ToastContainer />
    </Box>
  );
}

export default Workers;
