import React from 'react';
import { Container, Typography, Grid, Box, Paper, useMediaQuery, useTheme } from '@mui/material';
import Img1 from '../assets/Prepared-Environment-2.jpg'; // Importación de la imagen SVG local
import { useTranslation } from 'react-i18next';

const BlogAbut = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  return (
    <Container sx={{ padding: 2 }}>
      {/* Header with Image */}
      <Box
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${Img1})`, // Usa la imagen importada como background
          backgroundSize: 'contain', // La imagen se ajusta sin recortarse
          backgroundRepeat: 'no-repeat', // Evita que la imagen se repita
          backgroundPosition: 'center', // Centra la imagen
          height: isSmallScreen ? '250px' : '400px',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          
        }}
      >
        {/* <Typography
          variant="h4" 
          sx={{  fontWeight: 'bold', textAlign: 'center' }}
        >
          The Montessori Method: Education for the Future
        </Typography> */}
      </Box>

      {/* Blog Body */}
      <Paper sx={{ marginTop: 3, padding: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          {t('about.title')}
        </Typography>
        <Typography paragraph>
          {t('about.body1')}
        </Typography>
        <Typography paragraph>
          {t('about.body2')}
        </Typography>
        <Typography paragraph>
          {t('about.body3')}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 3, marginBottom: 2 }}>
          {t('about.accountable')}
        </Typography>
        <Typography paragraph>
          {t('about.body5')}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 3, marginBottom: 2 }}>
          {t('about.senseOfSelf')}
        </Typography>
        <Typography paragraph>
          {t('about.body4')}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 3, marginBottom: 2 }}>
          {t('about.advantagesTitle')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {t('about.promotesAutonomy')}
              </Typography>
              <Typography paragraph>
                {t('about.body2')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {t('about.respectPace')}
              </Typography>
              <Typography paragraph>
                {t('about.body3')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {t('about.socialSkills')}
              </Typography>
              <Typography paragraph>
                {t('about.body4')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default BlogAbut;
