import DrawerAppBar from '../components/Bar';
import ImgMediaCard from '../components/Card';
import MenuApp from '../components/MenuApp';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import useInfos from '../components/data'
import { isAuth } from './helpers';
import MontessoriComponent from '../components/Carucel';
import ScheduleComponent from '../components/ScheduleComponent';
import ContactMain from '../components/ContactMain';
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();
  const infos = useInfos();

  return (
    <Box>
      <DrawerAppBar />

      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Stack spacing={{ xs: 6, md: 8 }}>
          {!isAuth() && (
            <Box>
              <MenuApp />
            </Box>
          )}

          <Box>
            <ContactMain />
          </Box>

          <Box>
            <MontessoriComponent />
          </Box>

          <Box>
            <ScheduleComponent />
          </Box>

          <Box component="section" sx={{ pb: 2 }}>
            <Typography
              variant="h4"
              component="h2"
              align="center"
              sx={{ fontWeight: 700, color: '#2e4a35', mb: 4 }}
            >
              {t('home.discoverMore')}
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {infos.map((info) => (
                <ImgMediaCard
                  key={info.link}
                  title={info.title}
                  image={info.image}
                  description={info.description}
                  link={info.link}
                />
              ))}
            </Grid>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default Home;
