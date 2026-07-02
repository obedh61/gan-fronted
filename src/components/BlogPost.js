import React from 'react';
import { Container, Typography, Grid, Box, Paper, useMediaQuery, useTheme } from '@mui/material';
import Img from '../assets/img.svg'; // Importación de la imagen SVG local
import { useTranslation } from 'react-i18next';

const BlogPost = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  return (
    <Container sx={{ padding: 2 }}>
      {/* Header with Image */}
      <Box
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${Img})`, // Usa la imagen importada como background
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
        <Typography
          variant="h4" 
          sx={{  fontWeight: 'bold', textAlign: 'center' }}
        >
          {t('method.title')}
        </Typography>
      </Box>

      {/* Blog Body */}
      <Paper sx={{ marginTop: 3, padding: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          {t('method.historyTitle')}
        </Typography>
        <Typography paragraph>
          {t('method.body1')}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 3, marginBottom: 2 }}>
          {t('method.differencesTitle')}
        </Typography>
        <Typography paragraph>
          {t('method.body2')}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 3, marginBottom: 2 }}>
          {t('method.advantagesTitle')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {t('method.promotesAutonomy')}
              </Typography>
              <Typography paragraph>
                {t('method.body2')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {t('method.respectPace')}
              </Typography>
              <Typography paragraph>
                {t('method.body4')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {t('method.socialSkills')}
              </Typography>
              <Typography paragraph>
                {t('method.body5')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default BlogPost;
